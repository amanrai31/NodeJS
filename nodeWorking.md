### How nodeJS works

[EVENT LOOP RESOURCE](https://www.youtube.com/watch?v=os7KcmJvtN4)

[WORKERTHREAD RESOURCE](https://www.youtube.com/watch?v=Vej327jN8WI)

**Node design Philosophy => Optimized for I/O-bound concurrency, not CPU-bound computation.**

- `Blocking(Sync) & non-blocking(Async) operations` (Non-blocking task resolves normally & offloads work to OS or `libuv thread pool` and blocking task - it executes in main node thread(JS thread) & because it engages the main thread itself(hence blocking the event-loop) that is why we avoid using sync code. Number of treads(default =4, or equal to number of CPU-cores)

```
Call Stack -> process.nextTick() queue (HIGHEST priority) ->
-> Microtask Queue (Promises, queueMicrotask) -> Event Loop Phase (Timers → PendingCallback → Poll → Check → CloseCallback)
```

**IMPORTANT NOTE =>** Refer javaScript repo. The same event loop diagram applies here, the only change is that you can assume LivUV instead of web-api.

**IMPORTANT NOTE =>** `LivUV threadpool` and `workerNode` are two different things.

-----

📌 Core Mechanisms Behind Concurrency

- `Event queue`(orchestrator) - Pools OS for new n/w events from OS and polls form taskQueue & microTaskQueue. `Event-loop` looksto make a continuous watch over event-queue `FIFO operation`
- `Event Loop` =>	When the call stack is empty, the event loop Executes **ALL microtasks** and Then dequeues **ONE macrotask** (setTimeout, I/O callback)
- `Call Stack` =>	Executes JS code line-by-line (single thread). If the task is async(non-blocking) => 1. It offloads the task to `livUV(having thread pool)` via **`Event-demultiplxer`** (fs/crpto) || 2. Can offload to OS(n/w) || 3. PromiseCallback → microtask queue (via V8). Once the task is executed by the thread-pool(fs/crypto) OR OS(n/w) it is pushed back to taskQueue/callbackQueue. `V8 EXECUTES WHATEVER IN CALLSTACK`
- `Callback/Task Queue` =>	Stores callbacks(will push to event-queue once completed by threadPool) waiting to be executed by event-loop
- `Microtask-queue - V8` => When a promise resolve/reject, it's corresponding .then(cb) is immediately pushed to microtaskQueue by V8
- `libuv Thread Pool` =>	Handles async file system work, DNS lookup, crypto, etc.
- `OS Kernel`	 => Handles networking operations (non-blocking I/O)

**IMPORTANT NOTE :** Microtasks run after every macrotask execution, not just once per loop. WHEN MICROTASKQUEUE RUNS => CPU is blocked -> Event loop is frozen -> No timers, no I/O, nothing runs. So heavy sync task is dangerous inside promise-callback.

**IMPORTANT NOTE :** Async task inside Promise is executed by `livUV OR OS` but it's corresponding `.then(cb)` is managed by V8(push .then() to microtaskQueue immediately after promise fulfill). THERE IS CHANGE IN NODEWORKING2.PNG => MICROTASK-QUEUE IS MANAGED BY V8 (NOT BY LIVUV)

----- 

#### How It Actually Works

```js
// Here it is callback based API, not Promise-based API - no microTask-queue involved
fs.readFile("file.txt", () => {
  console.log("File done");
});

console.log("Hello");
```

Execution order => JS thread starts fs.readFile || After Js execution, the work is `offloaded to a thread pool` (not the main thread) || Main thread continues → prints "Hello" || When the background task completes, pushed to taskQueue -> pushed to Event-queue via deMultiplxer -> callStack || Event loop later executes callback → prints "File done"

```
// Answer the order
fs.readFile("file.txt", () => console.log("cb"));
fs.promises.readFile("file.txt").then(() => console.log("promise"));
console.log("sync");
```
### How Node.js Can Handle Thousands of Connections

Node doesn't create a thread per request (unlike Java/Python threaded servers). Instead, it uses non-blocking I/O. The event loop makes requests asynchronous and efficient. This is why Node.js is excellent for:

- High concurrency
- Realtime applications (Chat, Games, WebSockets)
- Microservices

### When Node Fails?

If CPU-heavy tasks block the main thread: Encryption loops || Image processing || Large JSON computation

→ They block the event loop → no concurrency. To avoid this, Node provides: `Worker Threads` || `Cluster Mode` || `Child Processes`

### Worker Threads/ Worker nodes

Worker node is an isolated node environment `(mini nodeJS)` which has it's own event-driven arch composed of v8 & livUV 

#### Summary

Node offloads I/O tasks because they spend most time waiting and blocking the main thread makes no sense. It does NOT offload CPU tasks automatically because they require active work, and moving them costs overhead and breaks Node’s simplicity and predictability.

**IMPORTANT NOTE :** Async operations are offloaded to the OS or libuv worker threads depending on the type of task, and synchronous code always runs on the main JavaScript thread.

-----

#### I/O Operation

Examples: reading file, DB call, network request.

- The CPU does almost no work.
- The request is waiting on external hardware (disk, network, kernel).
- The CPU is basically idle during the wait.
- So it makes sense to offload and continue running other tasks.
- While the disk is reading your file, Node can handle 10,000 more requests.

#### CPU-Intensive Operation

Examples: encryption, image processing, parsing huge JSON, loops.

- CPU is actively busy the whole time.
- No waiting for external hardware.
- The work is happening in memory, purely using CPU cycles.
- If you offload it, the CPU still has to do the work — just on another thread.

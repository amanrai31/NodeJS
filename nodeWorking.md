### How nodeJS works

[EVENT LOOP RESOURCE](https://www.youtube.com/watch?v=os7KcmJvtN4)

[WORKERTHREAD RESOURCE](https://www.youtube.com/watch?v=Vej327jN8WI)

**Node design Philosophy => Optimized for I/O-bound concurrency, not CPU-bound computation.**

- The request which comes to nodeJs server 1st comes to `event-queue(can assume callStack)`. `Event-loop` looksto make a continuous watch over event-queue `FIFO operation`

- `Blocking(Sync) & non-blocking(Async) operations` (Non-blocking resolves normally & offload work to OS or `libuv thread pool` for blocking - it executes in main node thread(JS thread) & because it engages the main thread itself(hence blocking the event-loop) we avoid using sync code. Number of treads(default =4, or equal to number of CPU-cores)

```
Call Stack
↓
process.nextTick() queue (HIGHEST priority)
↓
Microtask Queue (Promises, queueMicrotask)
↓
Event Loop Phase (Timers → PendingCallback → Poll → Check → CloseCallback)
```

-----

✅ How Node.js Handles Concurrency 

Node.js uses:

1. A single thread for executing JavaScript — the Event Loop

2. Multiple system/worker threads behind the scenes for heavy tasks — via libuv Thread Pool

So even though the JavaScript runtime is single-threaded, Node.js can still handle many concurrent operations efficiently.

📌 Core Mechanisms Behind Concurrency

Call Stack =>	Executes JS code line-by-line (single thread). || Event Loop =>	Decides what task to run next || Callback/Task Queue =>	Stores callbacks waiting to be executed || libuv Thread Pool =>	Handles async file system work, DNS lookup, crypto, etc. || OS Kernel	 => Handles networking operations (non-blocking I/O)


----- 

#### How It Actually Works

```js
fs.readFile("file.txt", () => {
  console.log("File done");
});

console.log("Hello");
```

Execution order => JS thread starts fs.readFile || After Js execution the work is `offloaded to a thread pool` (not the main thread) || Main thread continues → prints "Hello" || When the background task completes, callback is added to queue || Event loop later executes callback → prints "File done"

#### Why Node.js Can Handle Thousands of Connections

Node doesn't create a thread per request (unlike Java/Python threaded servers). Instead, it uses non-blocking I/O. The event loop makes requests asynchronous and efficient. This is why Node.js is excellent for:

- High concurrency
- Realtime applications (Chat, Games, WebSockets)
- Microservices

#### When Node Fails?

If CPU-heavy tasks block the main thread: Encryption loops || Image processing || Large JSON computation

→ They block the event loop → no concurrency. To avoid this, Node provides: `Worker Threads` || `Cluster Mode` || `Child Processes`

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

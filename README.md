# NodeJS (Backend)

NodeJs is open source, JS runtime environment(Where JS can run). (Made with chrome's V8 js engine + c++ => With some modification like removing DOM related thing such as `window` object, alert etc. && added things like cryptography, fileHandling etc.).

- We can run JS outside browser, JS can talk to native machine because of c++ & now we can can create webServers in JS to.

### 3 main parts of nodeJS

1. V8 Engine - compiles JavaScript to machine code
2. libuv - handles the event loop and asynchronous I/O operations
3. Core modules - built-in modules like fs, http, etc.

### 1st NodeJS program
- Install nodeJS in your machine
- make a folder, open that folder in IDE
- make some JS file like hi.js & inside that file we have - console.log("hi");
- Open terminal and go to the correct folder path & do `node <filename> = node hi OR node hi.js` - it will print the output


-----

**If we are setting up new node project in our local machine** => We do not have any package.json file rn so we do `npm init` & it will ask some question(response accordingly).

**If we are working on existing project like we fork or clone from github** => We already have `package.json` file so we do not need npm init command. We do `npm install` to install or `node_module` & all the dependencies that are declared in pakage.json 

**package.json =>** We have all the dependencies & scripts mentioned here. `"start" : "node index.js"` - this will run the index file of our node project (which is usually the starting point of project) - so we can run it by `npm run start` or `npm start`. **We can add more command under the same `start` script like cleanUp code, DB connection etc**

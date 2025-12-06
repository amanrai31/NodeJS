### This is a simple node application

1. Setup from local machine -> Make an empty folder -> open in code editor -> do `npm init`
2. Added the start script in package.json 
3. start/run the project using = `npm run start` || `npm start`

### This app has 2 parts =>

1. index.js & math.js(simple math's operation in modular way) - run by `npm start`
2. file.js - write,read file - run by `node file.js`

## Important note

If we import some module without any filePath then it import from `built-in node modules`


`Diff b/w require & import => require is syncronoud & can be written inside condtions || import loads asynchronously(Always on top)`

const http = require("http");
const fs = require("fs");
const resData = require("./resService");

const myServer = http.createServer((req,res)=>{
   const timeStamp  = new Date(Date.now());
   const timeString = timeStamp.toString();   
   console.log("Req received");
   fs.appendFile("reqLogs", `${timeString}, New req received at route ${req.url}\n`, (err)=>{
     const responseData = resData(timeStamp);
      res.end(responseData);
   })
});

myServer.listen(8000,()=> console.log("Server listing"));

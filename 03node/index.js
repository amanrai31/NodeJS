const express = require("express");

const app = express();
const port = 8000;

app.get("/", (req,res)=>{
    return res.send("Home");
})
app.get("/about",(req,res)=>{
    return res.send("About");
})
app.listen(port, ()=> console.log("Server started"));
const express = require("express");
const data = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const port = 8000;
app.listen(port, ()=> console.log("Server started"));

// Middleware for request Body in POST requests
app.use(express.urlencoded({extended:false}));

app.get("/", (req,res)=>{
  return res.send("Home => Visit /users OR /api/users");
})

// GET at /user will return server side rendered HTML - Only browser can use (SSR)
app.get("/users", (req,res)=>{
  const html = `
  <h1>SERVER SIDE RENDERED HTML</h1>
      <ul>
        ${data.map((entry)=> {
        return `<li> <p style="color:red;" > ${entry.first_name} </p> </li>`})
        .join("")}
      </ul>
  `
  res.send(html);
})

// GET  at /api/users will return users (JSON data). Any client(browser, mobile) can use accordingly 
app.route("/api/users").get((req,res)=>{
    res.send(data);   // data is already in json format so i just send otherwise we should use res.json 
}).post((req,res)=>{
    const newUser = req.body;
    data.push({id:data.length+1, ...newUser});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(data), (err,succ)=>{
      if(err){
        console.log("Error", err);
      }
      else{
        res.status(201).send(`User added successfully. UserId : ${data.length}`);
      }
    })
})


// NOTE: If we have same route & have multiple HTTP Methods - app.route("/route").get(...).post(...).delete(...)

// Dynamic route - app.get("/user/:id")

app.route("/api/users/:id").get((req,res)=>{
  console.log("Qeryyyyyy", req.params);
  const id = Number(req.params.id);
  const user = data.find((entry)=> entry.id===id);
  return res.json(user);
}).patch((req,res)=>{
    // When there was nothing inside this handler - It throws a HTML with Error - Cannot PATCH /api/users
    const reqBody = req.body;
    console.log(reqBody);
    console.log("paramss of /api/user/:id", req.params);
    const userId = Number(req.params.id);
    console.log("UserrrrID", userId);
    let updated = false;
    data.forEach((item,index)=>{
      if(item.id==userId){
        data[index] = {...item, ...reqBody};
        updated = true;
      }
    });
    if(!updated){
      res.status(404).send("User not found");
    }
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(data,null,2), (err,ok)=>{
      if(err){
        res.status(500).send("Error: Failed to update file");
      }
      else{
        res.send(`Patched, UserID : ${userId}`);
      }
    })
   
}).delete((req,res)=>{
    const userId = Number(req.params.id);
    const newData = data.filter((e)=>e.id!==userId);
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(newData, null, 2), (err,ok)=>{
      if(err){
        res.status(500).send("Failed to upload file");
      }
      else{
        res.send(`User deleted, userID:${userId}`);
      }
    })
})





const express = require("express");
const data = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const port = 8000;
app.listen(port, ()=> console.log("Server started"));

// Middleware for request Body
app.use(express.urlencoded({extended:false}));

// GET at /user will return server side rendered HTML - Only browser can use (SSR)
app.get("/users", (req,res)=>{
  const html = `
      <ul>
        ${data.map((entry)=> {
        return `<li> ${entry.first_name} </li>`
      }).join("")}</ul>
  `
  res.send(html);
})

// GET  at /api/users will return users (JSON data). Any client(browser, mobile) can use accordingly 
app.route("/api/users").get((req,res)=>{
    res.json(data);
}).post((req,res)=>{
    const reqBody = req.body;
    const id = data.length + 1;
    const newUser = {id, ...reqBody};
    data.push(newUser);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(data), 
      (err,data)=>{
        if(err){
        console.log("Error",err)}
        else{
            res.send(`User created successfully. UserID - ${id} `);
        }
    })
    console.log(reqBody);
})


// NOTE: If we have same route & have multiple HTTP Methods - app.route("/route").get(...).post(...).delete(...)

// Dynamic route - app.get("/user/:id")

app.route("/api/users/:id").get((re,res)=>{
  const id = Number(re.params.id);
  const user = data.find((entry)=> entry.id===id);
  return res.json(user);
}).patch((req,res)=>{
    // When there was nothing inside this handler - It throws a HTML with Error - Cannot PATCH /api/users
    const reqBody = req.body;
    console.log(reqBody);
    
   
}).delete((re,res)=>{

})



app.get("/", (req,res)=>{
    return res.send("Home");
})
app.get("/about",(req,res)=>{
    return res.send("About");
})

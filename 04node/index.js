const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();
const port = 8000;
app.listen(port, () => console.log("Server started"));

app.use(express.urlencoded({ extended: false }));

// Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,  // Should be ENUM 
    },

}, { timestamps: true });

// MongoDB connection => < mongoUrl/DbName >
mongoose.connect("mongodb://127.0.0.1:27017/node-mongo-app").then(() => {
    console.log("Mongo connected");
}).catch((err) => { console.log("Error while connecting mongo :", err) })

// Model
const User = mongoose.model("user", userSchema);



app.get("/", (req, res) => {
    return res.send("Home => Visit /users OR /api/users");
})

app.get("/users", async (req, res) => {
    const usersData = await User.find({});
    const html = `
  <h1>SERVER SIDE RENDERED HTML</h1>
      <ul>
        ${usersData.map((entry) => {
        return `<li> <p style="color:red;" > ${entry.firstName} </p> </li>`
    })
            .join("")}
      </ul>
  `
    res.send(html);
})
app.route("/api/users").get(async (req, res) => {
    const data = await User.find({});
    res.json(data);
}).post(async (req, res) => {
    const result = await User.create({
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender
    });
    console.log("mongo user:", result);
    res.status(201).send("Created");

})

app.route("/api/users/:id").get(async (req, res) => {
    console.log("Qeryyyyyy", req.params);
    const user = await User.findById(req.params.id);
    return res.json(user);
}).patch(async (req, res) => {

    const user = await User.findByIdAndUpdate(req.params.id, { firstName: req.body.first_name }).then(() => {
        res.send("User updated");
    }).catch(() => {
        res.status(404).send("User not found");
    })

}).delete((req, res) => {
    const userId = Number(req.params.id);
    const newData = data.filter((e) => e.id !== userId);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(newData, null, 2), (err, ok) => {
        if (err) {
            res.status(500).send("Failed to upload file");
        }
        else {
            res.send(`User deleted, userID:${userId}`);
        }
    })
})
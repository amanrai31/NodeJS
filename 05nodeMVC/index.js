const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const userRouter = require("./routes/users");
const connectMongoDb = require("./db");

const app = express();
const port = 8000;
app.listen(port, () => console.log("Server started"));

app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter);

// connect DB
connectMongoDb("mongodb://127.0.0.1:27017/node-mongo-app"); // Put url in ENV

app.get("/", (req, res) => {
    return res.send("Home => Visit /users OR /api/users");
})


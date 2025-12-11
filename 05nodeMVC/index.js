const express = require("express");
const userRouter = require("./routes/users");
const connectMongoDb = require("./db");
const {logReqRes} = require("./middlewares/index");

const app = express();
const port = 8000;
app.listen(port, () => console.log("Server started at port", port));

app.use(express.urlencoded({ extended: false }));
app.use("/users", userRouter);
app.use(logReqRes("log.txt"));

// connect DB
connectMongoDb("mongodb://127.0.0.1:27017/node-mongo-app"); // Put url in ENV

// app.get("/", (req, res) => {
//     return res.send("Home => Visit /users OR /api/users");
// })


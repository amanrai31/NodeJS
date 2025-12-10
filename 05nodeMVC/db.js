const mongoose = require("mongoose");

// MongoDB connection => < mongoUrl/DbName >

async function connectMongoDb(url){
    mongoose.connect(url).then(() => {
        console.log("Mongo connected");
    }).catch((err) => { console.log("Error while connecting mongo :", err) });
}
module.exports = connectMongoDb;
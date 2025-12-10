const mongoose = require("mongoose")

const userSchema = new mongoose({
firstName: {
    type: String,
    require: true,
 },
 lastName:{
    type: String,
 },
 email:{
    type: String,
    require:true,
    unique:true
 },
 gender: {
   type: String
 },
 age:{
    type: Number
 }
},{timestamps: true});

const User = mongoose.model("User", "userSchema");

module.exports = User;
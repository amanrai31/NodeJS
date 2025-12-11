const User = require("../models/users");

async function handleGetUsers(req,res){
    const data = await User.find({});
    res.json(data);
}
async function handlePostUser(req, res) {
    const result = await User.create({
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender
    });
    console.log("mongo user:", result);
    res.status(201).send("Created");

}

module.exports = {handleGetUsers,handlePostUser};
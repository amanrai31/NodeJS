const User = require("../models/users");

async function handleGetUser(req, res){
    console.log("Qeryyyyyy", req.params);
    const user = await User.findById(req.params.id);
    return res.json(user);
}

async function handlePatchUser(req, res){
    console.log("PATCH Req Body", req.body);
    const user = await User.findByIdAndUpdate(req.params.id, req.body).then(() => {
        res.send("User updated");
    }).catch(() => {
        res.status(404).send("User not found");
    })

}
async function handleDeleteUser(req, res){
    const user = await User.findByIdAndDelete(req.params.id, { firstName: req.body.first_name }).then(() => {
        res.send("User deleted");
    }).catch(() => {
        res.status(404).send("User not found");
    })

    
}


module.exports = {handleGetUser,handlePatchUser, handleDeleteUser};
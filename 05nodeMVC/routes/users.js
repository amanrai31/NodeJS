const express = require("express");
const {handleGetUsers, handlePostUser} = require("../controllers/users");
const {handleGetUser,handlePatchUser, handleDeleteUser} = require("../controllers/user");
const userRouter = express.Router();


// router.get("/users", async (req, res) => {
//     const usersData = await User.find({});
//     const html = `
//   <h1>SERVER SIDE RENDERED HTML</h1>
//       <ul>
//         ${usersData.map((entry) => {
//         return `<li> <p style="color:red;" > ${entry.firstName} </p> </li>`
//     })
//             .join("")}
//       </ul>
//   `
//     res.send(html);
// });
userRouter.route("/")
.get(handleGetUsers)
.post(handlePostUser);

userRouter.route("/:id")
.get(handleGetUser)
.patch(handlePatchUser)
.delete(handleDeleteUser)

module.exports = userRouter
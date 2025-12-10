const express = require("express");

const router = express.Router();

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
router.route("/").get(async (req, res) => {
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

router.route("/:id").get(async (req, res) => {
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
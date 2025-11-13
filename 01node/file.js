const fileSystem = require("fs");

// Sync - Will write/create file synchronously
// const file = fileSystem.writeFileSync("./sample.txt", "Write file using nodeJS fs");

// Async - write file
fileSystem.writeFile("./sample.txt", "Write file using Async nodeJS fs", (err)=>{});

// Sync - read file
// const res = fileSystem.readFileSync("./countries.txt", "utf-8");
// console.log(res);


// Async read file
fileSystem.readFile("./countries.txt", "utf-8", (err,res)=>{
    if(err){
        console.log("Error :", err);
    } else {
        console.log(res);
    }
})
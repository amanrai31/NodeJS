const fileSystem = require("fs");

// Sync - Will write/create file synchronously
// const file = fileSystem.writeFileSync("./sample.txt", "Write file using nodeJS fs");

// Async - write file => writeFile(path, data, callback)
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

// Async append file - appendFile(path, data, callback) - We can use to append log for every req.
fileSystem.appendFile("./countries.txt", `${Date.now()}\n`,(err)=>{
    if(err) console.log("Error while appending", err);
});

// Stat of a file
fileSystem.stat("./countries.txt", (err,res)=>{
    if(err){
        console.log("Error", err);
    }
    else console.log(res);
})


// OTHER fs related function => fs.cp("./countries.txt","./copyCountries.txt"); fs.unlink("./copyCountries.txt"); - this deletes the file
 
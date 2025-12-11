const fs = require("fs");

function logReqRes(filename) {
    return (req, res, next) => {
        const uri = req.url;
        const time = new Date(Date.now());
        const timeString = time.toString();
        fs.appendFile(filename, `Req at route => ${uri}, IP => ${req?.ip} @ ${timeString}`, (err, dat) => {
            if(err){
                console.log("Error while appending log");
            }
            next();
        })
    }

}
module.exports = {logReqRes};
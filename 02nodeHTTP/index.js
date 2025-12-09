const http = require("http");
const fs = require("fs");
const resData = require("./resService");

const myServer = http.createServer((req, res) => {
    const timeStamp = new Date(Date.now());
    const timeString = timeStamp.toString();
    console.log("Req received");
    fs.appendFile("reqLogs", `${timeString}, New req received at route ${req.url}\n`, (err) => {
        switch (req.url) {
            case "/": {
                const responseData = resData(timeStamp);
                res.end(responseData);
            }
                break;
            case "/about":
                res.end("You are at about route");
                break;
            default:
                res.end();
        }

    })
});

const port = 8000;

myServer.listen(port, () => console.log(`Server listing @ ${port}`));

// We can use url library {npm i url}. Which is used to parse the url(protocol,domain,route,queryParam,http methods etc.). & we can use 
// them inside switch case for queryParam or http verbs like what to send if method is GET or POST. But that will lead to a very confusing code
// and will take manual writing of code too much - That is where express comes
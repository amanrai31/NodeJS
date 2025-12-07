# Express

`npm i express`

Whatever we did in 02node application using raw http module (made a simple http server) - we will do that using EXPRESS.

Express internally has `http module` & manage a lot of things for us.


## Rest APIs

Works on Client-server architecture, respect http methods(best practice). We can send Text, media, JSON, HTML etc over REST

**NOTE :** We used mockaroo to mock DB.

**NOTE :** We should send response as `res.json(...object)` - RECOMMENDED or we can use `res.send(...some string message)`

**NOTE :** POST method - we fill req body as - `x-www-form-urlencoded` (new), 
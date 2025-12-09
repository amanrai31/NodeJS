## Middleware, HTTP Headers, HTTP STATUS CODE, MongoDB

### Middleware

Middleware functions have access to `req object`. `res object` and `next middleware function` in app's req-res cycle.
Next middleware is commonly denoted by `next`

**Common Use of MW** => `Auth` | `Error-handling` | `logging` | `change in req-res` | 

**NOTE :** Middleware should either end the req-res cycle or it should call the next MW in stack, otherwise the req will be trapped/stuck here only.

MW can execute any code | make change to req-res object | can end req-res cycle | call next MW in stack

Express app can use => Application level MW | Route-level MW | Built-in MW | Third-party MW


------

### HTTP Headers

Analogy of a letter, we have `addr of from & to` and some basic info outside the envelope (`which is http headers`) & we have our main content inside the envelope(`body`);

- HTTP Header => It is meta-data(data about data) about req-res body/API. We have `Request header` and `Response headers`

- We can set our own `custom req-res header` like - `res.setHeader("X-myAge": "25")` => Sets the req header. We append `X` before custom header(Recommended)


-----

## HTTPS STATUS CODE

It tells the status of a HTTP request => `res.status(CODE).json(response)`

1. Informational response => (100-199)
2. Successful response => (200-299)
3. Redirection message => (300-399)
4. Client-error response => (400-499)
5. Server-error response => (500-599)


-----

## MongoDB

MongoDB is no-sql document based DB, String support for aggregation-pipe, Works on `BSON` format, Best for node APP.

Mongo is based on collections(equivalent of table in SQL) and documents

=> Install mongoDB on your local machine, install mongoose inside your app/project `npm i mongoose`

=> First we define Schema (Structure of data) | then we define model based on schema.

=> Command in code => `model.find({})` - returns all entries of that model | `model.findById(id)` - returns result against id | `model.findByIdAndUpdate` | `model.findByIdAndDelete`

**While working in local =>** We start our DB(mongo) first => `sudo systemctl start mongod` => open mongo shell => `mongosh` => Now mongo shell is started, you can do all DB operations here. 

#### Commonly used commands - 

1. Orientation (Seeing what you have)
- `show dbs` | `db` - return current db name | `show collections` - list all collections in current DB | `use <collection>` | `use <db>` | `exit`

2. Read 
- `db.<collectionName>.find()` - give all data
- `db.<collectionName>.find({age:30})` - Give everyone whose age is 30
- `db.<collectionName>.findOne({ name: "Alice" })` - Returns the first document that matches the criteria. Useful when searching by a unique ID or email.

3. Write
- `db.<Collection>.insertOne({ name: "Alice", age: 25 })`
- `db.<Collection>.insertMany({ name: "Alice", age: 25 }, {name: "Aman", age: 24})`

4. Update

- `db.<collection>.updateOne( {filter}, {update actions} )` => db.myCollection.updateOne({ name: "Bob" },{ $set: { age: 31 } }) => If you forget `$set`, you might accidentally replace the entire document with just the updated field.

- `db.<collection>.updateMany( {filter}, {update actions} )` => db.myCollection.updateMany({ city: "New York" },{ $set: { country: "USA" } })

5. Delete

- `db.myCollection.deleteOne({ name: "Aman" })`
- `db.myCollection.deleteMany({ city: "Jaipur" })`

-----

## MVC (Model View Controller)

- `Controller` manipulates the model and `Model` updates the `View`
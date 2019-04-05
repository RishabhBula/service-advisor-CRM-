const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongoose");
const path = require("path");
const { mode } = require("./config/app");

app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
console.log("mode");
console.log(mode);
console.log("mode");

if (mode == "development") {
  const cors = require("cors");
  var corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token", "authorization"]
  };
  app.use(cors(corsOption));
}

let url ="mongodb://localhost:27017/crm360";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
 
  // db.createCollection("customers", function(err, res) {
  //   if (err) throw err;
  //   console.log("Collection created!");
  //   db.close();
  // });
  //  var myobj = { name: "Company Inc", address: "Highway 37" };
  //  db.collection("customers").insertOne(myobj, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 document inserted");
  //   db.close();
  // });
});

// const apiRoutes = require("./routes/adminRoutes/apiRoutes");
// app.use("/api", apiRoutes);

 const apiApiRoutes = require("./routes/apiRoutes/apiRoutes");
 app.use("/api", apiApiRoutes);
// app.use(express.static(path.join(__dirname, "build")));
// app.get("/admin", ({}, res) => {
// res.sendFile(path.join(__dirname, "build", "admin.html"));
// });
// app.get("/admin/*", ({}, res) => {
// res.sendFile(path.join(__dirname, "build", "admin.html"));
// });
// app.get("/", ({}, res) => {
// res.send("Hello! Welcome to Hog Work!");
// });
// app.get("/*", ({}, res) => {
// res.send("Hello! Welcome to Hog Work!");
// });
const port = process.env.PORT || 8001;
const server = http.createServer(app);
server.listen(port, () => {
console.log(`App listening to port ${port}`);
});

module.exports = app;
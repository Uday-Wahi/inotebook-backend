require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const { json } = require("express");

connectToMongo();
const app = express();
const port = process.env.PORT || 3000;
const hostname = "localhost";

//Middleware
app.use(json());

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

//home page
app.get("/", (req, res) => {
  res.send("home page here");
});

//starting the server
app.listen(port, hostname, () => {
  console.log(`iNoteBook server http://${hostname}:${port}`);
});

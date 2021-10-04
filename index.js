require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const { json } = require("express");
const path = require("path");

connectToMongo();
const app = express();
const port = process.env.PORT || 3000;
const hostname = "localhost";

// Middleware
app.use(json());
app.use(cors());

// serve react build static files
app.use(express.static(path.resolve(__dirname, "../inotebook/build")));

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// home page
app.get("/", (req, res) => {
  res.send("home page here");
});
// all other requests will be redirected to "/" with 302 status code
app.get("*", (req, res) => {
  res.redirect("/");
});

// starting the server
app.listen(port, hostname, () => {
  console.log(`iNoteBook server http://${hostname}:${port}`);
});

require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const { json } = require("express");

// connectToMongo();
const app = express();
const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

// Middleware
app.use(json());
app.use(cors());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// home page
app.get("/", (req, res) => {
  res.send("<h1>API is sending response</h1>");
});

// Connect to the database before listening
connectToMongo.then(() => {
  // starting the server
  app.listen(port, hostname, () => {
    console.log(`iNoteBook server http://${hostname}:${port}`);
  });
});

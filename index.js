require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const { json } = require("express");

connectToMongo();
const app = express();
const port = process.env.PORT || 3000;
const hostname = "localhost";

app.use(json());

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, hostname, () => {
  console.log(`server listening at http://${hostname}:${port}`);
});

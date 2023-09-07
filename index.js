require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { json } = require("express");
const mongoose = require("mongoose");

const app = express();
const mongoURI = process.env.MONGO_URI;
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

const connectToMongo = async () => {
  //mongoose connection options
  option = {
    serverSelectionTimeoutMS: 1000,
    socketTimeoutMS: 60000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  // starting the connection to mongoDB
  try {
    const conn = await mongoose.connect(mongoURI, option);
    console.log("Connected to mongoDB successfully");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

//Event emitters handling on mongoose client
mongoose.connection.once("disconnected", () => {
  console.log("Connection with mongoDB broken");
});

// Connect to the database before listening
connectToMongo().then(() => {
  // starting the server
  app.listen(port, hostname, () => {
    console.log(`iNoteBook server http://${hostname}:${port}`);
  });
});

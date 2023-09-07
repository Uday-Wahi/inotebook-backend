require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  //mongoose connection options
  option = {
    serverSelectionTimeoutMS: 1000,
    socketTimeoutMS: 60000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  // starting the connection to mongoDB
  await mongoose.connect(mongoURI, option, (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to mongoDB successfully");
  });
};

//Event emitters handling on mongoose client
mongoose.connection.once("disconnected", () => {
  console.log("Connection with mongoDB broken");
});

module.exports = connectToMongo;

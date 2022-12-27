require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

const router = express.Router();
const jwtsecret = process.env.JWT_SECRET;

// user input validation schema
let credValidate = [
  body("name", "your name should be between 3 to 26 characters").isLength({
    min: 3,
    max: 26,
  }),
  body("email", "enter a valid email").isEmail(),
  body("password", "your password should be atleast 12 characters").isLength({
    min: 8,
  }),
];

// ROUTE 1: Create a User using: POST "/api/auth/createuser", Doesn't require login
router.post("/createuser", credValidate, async (req, res) => {
  // user creds validation, error handling and returning if bad request
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  // extracting email and password from request body
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    // Checking whether the user with this email already exists
    // TODO --> create a function to wrap the response return code, add json output as the argument
    if (user)
      return res
        .status(400)
        .json({ error: "Sorry a user with this E-Mail already exists" });

    // Generating salt
    const salt = bcrypt.genSaltSync();
    // Hashing the password with salt
    const hashedPass = bcrypt.hashSync(password, salt);

    // creating a new user in database
    user = await User.create({
      name: req.body.name,
      password: hashedPass,
      email: req.body.email,
    });

    // Getting the user id as data for the JWT Token
    const data = { user: { id: user.id } };
    // Creating JWT Token
    const authToken = jwt.sign(data, jwtsecret);

    // Sending the AuthToken
    res.json({ authToken });

    // Database error
  } catch (err) {
    res.status(500).send("Internal Server Error Occured");
  }
});

// ROUTE 2: Authenticate a User using: POST "/api/auth/login", Doesn't require login
router.post("/login", credValidate[1], credValidate[2], async (req, res) => {
  // user creds validation, error handling and returning if bad request
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  // extracting email and password from request body
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    //  Checking for login E-mail correct or not
    // TODO --> create a function to wrap the response return code, add json output as the argument
    if (!user)
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });

    // Comparing the entered passowrd and the password hash
    const passwordCompare = bcrypt.compareSync(password, user.password);

    //  Checking for login password correct or not
    if (!passwordCompare)
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });

    // Getting the user id as data for the JWT Token
    const data = { user: { id: user.id } };
    // Creating JWT Token
    const authToken = jwt.sign(data, jwtsecret);

    // Sending the AuthToken
    res.json({ authToken });

    // Database error
  } catch (err) {
    res.status(500).send("Internal Server Error Occured");
  }
});

// ROUTE 3: Fetching user details using: POST "/api/auth/fetchuser", require login
router.post("/fetchuser", fetchUser, async (req, res) => {
  try {
    const userID = req.user.id;
    // Find the user details by it's ID and select every field excluding password
    const user = await User.findById(userID).select("-password");

    // sending the user details
    res.send(user);

    // database error
  } catch (err) {
    res.status(500).send("Internal Server Error Occured");
  }
});
module.exports = router;

require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtsecret = process.env.JWT_SECRET;

// user input validation scheme
let userCredsValidate = [
  body("name", "your name should be between 3 to 26 characters").isLength({
    min: 3,
    max: 26,
  }),
  body("password", "your password should be atleast 12 characters").isLength({
    min: 12,
  }),
  body("email", "enter a valid email").isEmail(),
];

// Create a User using: POST "/api/auth/createuser", Doesn't require login
router.post("/createuser", userCredsValidate, async (req, res) => {
  // user creds validation, error handling and returning if bad request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Checking whether the user with this email already exists
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this E-Mail already exists" });
    }

    // Generating salt, hashing the password
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // creating a new user in database
    user = await User.create({
      name: req.body.name,
      password: hashedPass,
      email: req.body.email,
    });

    // Creating JWT Token
    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, jwtsecret);

    // Sending the token instead of user input data
    res.json({ authToken });

    // Database error
  } catch (err) {
    res.status(500).send(`<h2>database error</h2><br><p>${err.name}</p>`);
  }
});

module.exports = router;

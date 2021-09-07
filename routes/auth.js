const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const User = require("../models/User");

// Create a User using: POST "/api/auth/", Doesn't require Auth
router.post("/", [
  body('email').isEmail(),
  body('name').isLength({min:6,max:26}),
  body('password').isLength({min:10})
],(req, res) => {
  const user = User(req.body);
  user.save();
  res.send(req.body);
});

module.exports = router;

require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtsecret = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
  // Get the JWT Token from request header
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).send({ error: "No authentication token found" });
  }
  try {
    const tokenDecoded = jwt.verify(token, jwtsecret);
    req.user = tokenDecoded.user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;

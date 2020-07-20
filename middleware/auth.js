const jwt = require("jsonwebtoken");
const config = require("../config");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ errors: "Invalid Token" });
  }

  try {
    const decoded = jwt.verify(token, config.secretOrKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

module.exports = auth;

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY || "YOUR_SECRET";

// Login Token Generate

const generateToken = (data) => {
  return jwt.sign(data, jwtSecretKey, { expiresIn: "720h" });
};

// Forgot Password Token Generate

const generateTokenForgotPassword = (data) => {
  return jwt.sign(data, jwtSecretKey);
};

const authService = {
  generateToken,
  generateTokenForgotPassword,
};

module.exports = { authService };

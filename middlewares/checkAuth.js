import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

// Verify Token
export const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    // no token in header:
    if (!authHeader) {
      return res.sendStatus(401);
    }
    // get the token
    const token = authHeader.split(" ")[1];
    // secret key for jsonwebtoken for verification
    const jwtKey = process.env.JWT_KEY;

    // verify token
    jwt.verify(token, jwtKey, async (err, payload) => {
      // invalid token in header:
      if (err) {
        return res.sendStatus(403);
      }
      // {_id, username} is the extracted and decoded payload of the token
      // user data will be searched in the database
      const user = await User.findOne({ username: payload.username });
      // user not found
      if (!user) {
        return res.sendStatus(404);
      }
      // The user data of the user will be saved in 'req.user' for the subsequent routes
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};

// Verify Admin
export const checkAdmin = (req, res, next) => {
  // no admin, forbidden
  // extract admin value from req.user
  console.log(`${req.user.username} is an admin:`, req.user.admin);
  if (!req.user.admin) {
    return res.sendStatus(403);
  }
  next();
};

// Verify API key
export const checkApiKey = (req, res, next) => {
  try {
    const API_KEY = process.env.FRONTEND_API_KEY;
    // Extracts the 'frontend-api-key' from the request headers
    // and compares it with the predefined API_KEY stored in environment variables.
    const apiKeyHeaders = req.headers["frontend-api-key"];
    if (apiKeyHeaders && apiKeyHeaders === API_KEY) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: Invalid API key." });
  } catch (err) {
    next(err);
  }
};

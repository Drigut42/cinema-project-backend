import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET all user accounts
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// GET a single user account (admin)

export const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// GET own user-profile

export const getOwnProfile = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const user = await User.findById(userID);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// UPDATE a user/account

const updateAccount = (isAdmin) => {
  return async (req, res, next) => {
    try {
      const { username, password, email, profilePicture } = req.body;
      // Make sure profilePicture is NOT included, if it is include, delete!
      if (profilePicture) {
        delete req.body.profilePicture;
      }

      if (username) {
        // if user exists in the database, reject!
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "This user already exists in the Database!" });
        }
      }
      if (password) {
        // if password isn't at least 6 characters long, reject!
        if (password.length < 6) {
          return res
            .status(400)
            .json({ message: "Password must be at least 6 characters long." });
        }
        // password hashing
        const hashedPassword = await bcrypt.hash(password, 13);
        req.body.password = hashedPassword;
      }
      if (email) {
        // if email exists, reject!
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res
            .status(400)
            .json({ message: "This email already exists in the Database!" });
        }
      }

      // Update User or Admin
      // for a normal user admin is default false, only admins can change their status
      // ID will be extracted from the token, not URL
      if (!isAdmin) {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { ...req.body, admin: false },
          {
            runValidators: true,
            new: true,
          }
        );
        return res
          .status(200)
          .json({ message: "User has been updated.", user: updatedUser });
      }
      // Admin update:
      // if an admin updates their data or data of another user
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          runValidators: true,
          new: true,
        }
      );
      return res
        .status(200)
        .json({ message: "User/Admin has been updated.", user: updatedUser });
    } catch (err) {
      next(err);
    }
  };
};

// Update account of ADMIN:
export const updateAdmin = updateAccount(true);
// Update account of User:
export const updateOwnProfile = updateAccount(false);

// DELETE an account/user (admin)

export const deleteUser = async (req, res, next) => {
  try {
    const userToDelete = await User.findByIdAndDelete(req.params.id);
    userToDelete
      ? res.status(200).json({
          message: "User has been deleted",
          username: userToDelete.username,
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

// DELETE own account
export const deleteOwnProfile = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const userToDelete = await User.findByIdAndDelete(userID);
    userToDelete
      ? res.status(200).json({
          message: "User has been deleted",
          username: userToDelete.username,
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

// __________________Register and Login_________________________________

// REGISTER

const register = (isAdmin) => {
  return async (req, res, next) => {
    try {
      const { username, password, email, profilePicture } = req.body;
      // Make sure profilePicture is NOT included, if it is include, delete!
      if (profilePicture) {
        delete req.body.profilePicture;
      }

      // username, password and email are required
      if (!username || !password || !email) {
        return res
          .status(400)
          .json({ message: "username, password and email are required." });
      }
      // if password isn't at least 6 characters long, reject!
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long." });
      }
      // if user exists, reject!
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "This user already exists in the Database!" });
      }
      // if email exists, reject!
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "This email already exists in the Database!" });
      }

      // if user is new and username, password and email has been entered -> insert data into the database
      // 1. hash password before saving it
      const hashedPassword = await bcrypt.hash(password, 13);
      req.body.password = hashedPassword;
      // for a normal user admin is default false, only admins can create another admin
      if (!isAdmin) {
        const newUser = await User.create({ ...req.body, admin: false });
        return res
          .status(201)
          .json({ message: "User has been registered.", user: newUser });
      }
      const newUser = await User.create(req.body);
      return res
        .status(201)
        .json({ message: "User has been registered.", user: newUser });
    } catch (err) {
      next(err);
    }
  };
};

// ADMIN Register-Endpoint:
export const registerAdmin = register(true);
// USER Register-Endpoint:
export const registerOwnProfile = register(false);

// Login-Endpoint:

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // username and password are required
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please enter username and password." });
    }

    // if the user doesn't exist in the database, reject!
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    // Compare entered password with hashed password in the database:
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // if the password is wrong, reject!
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password!" });
    }
    // create JWT
    const jwtKey = process.env.JWT_KEY;
    // admin should be in the token for role verification
    const token = jwt.sign(
      { _id: user._id, username: user.username, admin: user.admin },
      jwtKey,
      {
        expiresIn: "1h",
      }
    );
    // send token!
    return res.json({ token });
  } catch (err) {
    next(err);
  }
};

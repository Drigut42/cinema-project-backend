import User from "../models/userModel.js";

// GET all user accounts
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// GET a single user account

export const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// CREATE an account(user)

export const postUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// UPDATE a user/account

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// DELETE an account/user

export const deleteUser = async (req, res, next) => {
  try {
    const userToDelete = await User.findByIdAndDelete(req.params.id);
    userToDelete ? res.status(200).json(userToDelete) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

// __________________Register and Login_________________________________

export const registerUser = async (req, res, next) => {
  try {
    // 1. hash password before saving it
    // ? does the user already exist?
    const { password } = req.body;
    // password =...
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

import express from "express";

import {
  getAllUsers,
  getSingleUser,
  updateOwnProfile,
  deleteUser,
  login,
  registerAdmin,
  updateAdmin,
  getOwnProfile,
  deleteOwnProfile,
  registerOwnProfile,
} from "../controllers/userControllers.js";
import { checkAdmin, checkToken } from "../middlewares/checkAuth.js";
import { methodNotAllowed } from "../middlewares/errorMiddleware.js";

// Imports for profile picture route:
import {
  deleteProfilePic,
  getProfilePic,
  uploadProfilePic,
} from "../controllers/userProfilePicController.js";
// multer
import upload from "../libs/multerConfig.js";

const userRouter = express.Router();

// Route for registration
userRouter.route("/register").post(registerOwnProfile).all(methodNotAllowed);
userRouter
  .route("/register-admin")
  .post(checkToken, checkAdmin, registerAdmin)
  .all(methodNotAllowed);

// Route for login
// userRouter.route("/login");
userRouter.route("/login").post(login).all(methodNotAllowed);

// Normal user (OwnProfile) can only create, update and delete their own account.
// We get the user ID from the token instead of the URL to improve security.
// This makes sure users can only update their own data and not someone else's.
userRouter
  .route("/user-profile")
  .get(checkToken, getOwnProfile)
  .patch(checkToken, updateOwnProfile)
  .delete(checkToken, deleteOwnProfile)
  .all(methodNotAllowed);

// ! Authorization: Only admins are allowed to access all user accounts
userRouter
  .route("/all")
  .get(checkToken, checkAdmin, getAllUsers)
  .all(methodNotAllowed);

// Admin can create, read, update, and delete data.
userRouter
  .route("/admin/:id")
  .get(checkToken, checkAdmin, getSingleUser)
  .patch(checkToken, checkAdmin, updateAdmin)
  .delete(checkToken, checkAdmin, deleteUser)
  .all(methodNotAllowed);

// PROFILE PICTURE ROUTE
// Route for handling file uploads at `/profile-pic`.
// The name attribute in the file input field ("profilePic") must match the name used in the `upload.single("profilePic")` middleware.

userRouter
  .route("/profile-pic")
  .get(checkToken, getProfilePic)
  .post(checkToken, upload.single("profilePic"), uploadProfilePic)
  .delete(checkToken, deleteProfilePic)
  .all(methodNotAllowed);

export default userRouter;

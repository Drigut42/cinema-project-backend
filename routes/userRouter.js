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

const userRouter = express.Router();

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

// Route for registration

userRouter.route("/register").post(registerOwnProfile).all(methodNotAllowed);
userRouter
  .route("/register-admin")
  .post(checkToken, checkAdmin, registerAdmin)
  .all(methodNotAllowed);

// Route for login
// userRouter.route("/login");
userRouter.route("/login").post(login).all(methodNotAllowed);

export default userRouter;

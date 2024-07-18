import express from "express";

import {
  getAllUsers,
  getSingleUser,
  postUser,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

// Route "/" for GET and POST
// ! Authorization
// ? postUser -> register
userRouter.route("/").get(getAllUsers).post(postUser);

// Route "/:id" for GET, PATCH and DELETE
// ! Authorization
userRouter
  .route("/:id")
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

// Route for registration
// userRouter.route("/register");

// Route for login
// userRouter.route("/login");

//   export the Router:
export default userRouter;

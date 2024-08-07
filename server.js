import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import connect from "./libs/db.js";
import movieScreeningRouter from "./routes/movieScreeningRouter.js";
import userRouter from "./routes/userRouter.js";
// import { checkAdmin, checkToken } from "./middlewares/checkAuth.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import upload from "./libs/multerConfig.js";
import { checkToken } from "./middlewares/checkAuth.js";
import User from "./models/userModel.js";
dotenv.config();

await connect();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());

// parse JSON-Data in Request-Body
app.use(express.json());

// Router for movie screenings
app.use("/movie-screenings", movieScreeningRouter);

// Router for accounts/users
app.use("/users", userRouter);

// Route for handling file uploads at `/upload`.
// The name attribute in the file input field ("profilePic") must match the name used in the `upload.single("profilePic")` middleware.

// 'import.meta.url': Provides the URL of the current module. Used to convert the URL to a file path.
const __filename = fileURLToPath(import.meta.url);
// Extracts the directory name from the file path:
const __dirname = dirname(__filename);
//  Path of uploaded profile pictures
const uploadPath = process.env.UPLOAD_PATH;

app.post(
  "/profile-pic",
  checkToken,
  upload.single("profilePic"),
  async (req, res, next) => {
    try {
      // check if a picture was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // 1.Find the user using the ID stored in the token
      const user = await User.findById(req.user._id);
      if (
        user.profilePicture &&
        user.profilePicture !== "default-profilePic.png"
      ) {
        // * Delete the old profile picture before uploading a new picture
        const oldPicPath = path.join(
          __dirname,
          uploadPath,
          user.profilePicture
        );
        // fs.unlink is async
        fs.promises
          .unlink(oldPicPath)
          .then(() => console.log("file was deleted!"))
          .catch((err) => console.error("Error deleting file:", err));
      }

      // 2.Set the file name of the uploaded image in the user profile
      user.profilePicture = req.file.filename;

      // 3.Save the changes to the user
      await user.save();
      // 4.Send message:
      return res.status(201).json({ message: "File successfully uploaded." });
    } catch (err) {
      next(err);
    }
  }
);

// Route to retrieve the uploaded images
app.get("/profile-pic", checkToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    // check if the user exists and a profile picture is available
    if (user && user.profilePicture) {
      // Create the file path for the profile picture:
      const filePath = path.join(__dirname, uploadPath, user.profilePicture);
      // send the file!
      return res.sendFile(filePath);
    } else {
      return res.status(404).json({ message: "Profile picture not found." });
    }
  } catch (err) {
    next(err);
  }
});

// Route to delete profile picture
app.delete("/profile-pic", checkToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.profilePicture === "default-profilePic.png") {
      return res.status(404).json({ message: "Profile picture not found." });
    }
    // * Delete the old profile picture
    const oldPicPath = path.join(__dirname, uploadPath, user.profilePicture);
    // fs.unlink is async
    fs.promises
      .unlink(oldPicPath)
      .then(() => console.log("file was deleted!"))
      .catch((err) => console.error("Error deleting file:", err));

    // Set the file name of the default profile picture
    user.profilePicture = "default-profilePic.png";
    // Save the changes to the user
    await user.save();
    // Send message:
    return res.status(200).json({ message: "Profile picture deleted!" });
  } catch (err) {
    next(err);
  }
});

// * TO DO: whitlisting, dont include pfp

app.use(errorMiddleware);

app.listen(port, () => {
  console.log("Server is running on:", port);
});

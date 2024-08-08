import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// import path, { dirname } from "path";
// import { fileURLToPath } from "url";

import connect from "./libs/db.js";
import movieScreeningRouter from "./routes/movieScreeningRouter.js";
import userRouter from "./routes/userRouter.js";
// import { checkAdmin, checkToken } from "./middlewares/checkAuth.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
// import upload from "./libs/multerConfig.js";
// import { checkToken } from "./middlewares/checkAuth.js";
// import User from "./models/userModel.js";
dotenv.config();

await connect();
const port = process.env.PORT || 3000;
const app = express();

// Use Helmet to set different HTTP headers for better security
app.use(helmet());
// Use CORS to allow requests from specific domains
app.use(cors());

// parse JSON-Data in Request-Body
app.use(express.json());

// Router for movie screenings
app.use("/movie-screenings", movieScreeningRouter);

// Router for accounts/users/profile picture
app.use("/users", userRouter);

// Middleware for handling errors globally
app.use(errorMiddleware);

app.listen(port, () => {
  console.log("Server is running on:", port);
});

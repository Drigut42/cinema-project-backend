import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./libs/db.js";
import movieScreeningRouter from "./routes/movieScreeningRouter.js";
import userRouter from "./routes/userRouter.js";
// import { checkAdmin, checkToken } from "./middlewares/checkAuth.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
dotenv.config();

await connect();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());

// parse JSON-Data in Request-Body
app.use(express.json());

// Router for movie screenings
app.use("/moviescreenings", movieScreeningRouter);

// Router for accounts/users
app.use("/users", userRouter);

// // !PROTECTED ROUTE
// app.get("/protected", checkToken, checkAdmin, (req, res, next) => {
//   try {
//     res.status(200).json({ message: "AUTHORIZATION valid" });
//   } catch (err) {
//     next(err);
//   }
// });
app.use(errorMiddleware);

app.listen(port, () => {
  console.log("Server is running on:", port);
});

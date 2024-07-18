import express from "express";

import dotenv from "dotenv";
import connect from "./libs/db.js";
import movieScreeningRouter from "./routes/movieScreeningRouter.js";
import userRouter from "./routes/userRouter.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
dotenv.config();

await connect();

const port = process.env.PORT || 3000;
const app = express();

// parse JSON-Data in Request-Body
app.use(express.json());

// Router for movie screenings
app.use("/moviescreenings", movieScreeningRouter);

// Router for accounts/users
app.use("/users", userRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log("Server is running on:", port);
});

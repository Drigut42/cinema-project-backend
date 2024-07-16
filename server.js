import express from "express";

import dotenv from "dotenv";
import connect from "./libs/db.js";
import movieScreeningRouter from "./routes/movieScreeningRouter.js";
dotenv.config();

await connect();

const port = process.env.PORT || 3000;
const app = express();

// parse JSON-Data in Request-Body
app.use(express.json());

app.use("/moviescreenings", movieScreeningRouter);

app.listen(port, () => {
  console.log("Server is running on:", port);
});

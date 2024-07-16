import express from "express";

import {
  getALLMovieScreening,
  postMovieScreening,
} from "../controllers/movieScreeningControllers.js";

const movieScreeningRouter = express.Router();

movieScreeningRouter
  .route("/")
  .get(getALLMovieScreening)
  .post(postMovieScreening);

export default movieScreeningRouter;

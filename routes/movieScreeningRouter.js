import express from "express";

import {
  deleteMovieScreening,
  getALLMovieScreenings,
  getSingleMovieScreening,
  postMovieScreening,
  updateMovieScreening,
} from "../controllers/movieScreeningControllers.js";

const movieScreeningRouter = express.Router();

movieScreeningRouter
  .route("/")
  .get(getALLMovieScreenings)
  .post(postMovieScreening);

movieScreeningRouter
  .route("/:movieIndex")
  .get(getSingleMovieScreening)
  .patch(updateMovieScreening)
  .delete(deleteMovieScreening);

export default movieScreeningRouter;

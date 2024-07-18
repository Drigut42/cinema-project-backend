import express from "express";

import {
  deleteMovieScreening,
  getALLMovieScreenings,
  getSingleMovieScreening,
  postMovieScreening,
  updateMovieScreening,
} from "../controllers/movieScreeningControllers.js";

const movieScreeningRouter = express.Router();
// ! Authorization for post,patch,delete? (admin)

// Route "/" for GET and POST
movieScreeningRouter
  .route("/")
  .get(getALLMovieScreenings)
  .post(postMovieScreening);

// Route "/:movieIndex" for GET, PATCH and DELETE
movieScreeningRouter
  .route("/:movieIndex")
  .get(getSingleMovieScreening)
  .patch(updateMovieScreening)
  .delete(deleteMovieScreening);

//   export the Router:
export default movieScreeningRouter;

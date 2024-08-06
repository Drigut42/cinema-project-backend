import express from "express";

import {
  deleteMovieScreening,
  getALLMovieScreenings,
  getSingleMovieScreening,
  postMovieScreening,
  updateMovieScreening,
} from "../controllers/movieScreeningControllers.js";
import {
  checkAdmin,
  checkApiKey,
  checkToken,
} from "../middlewares/checkAuth.js";
import { methodNotAllowed } from "../middlewares/errorMiddleware.js";

const movieScreeningRouter = express.Router();

// The frontend can access and update(visitors, revenue...) movie data with the API key.
movieScreeningRouter.route("/api").get(checkApiKey, getALLMovieScreenings);
movieScreeningRouter
  .route("/api/:movieIndex")
  .patch(checkApiKey, updateMovieScreening);

// Admin can create, read, update, and delete data.
movieScreeningRouter
  .route("/admin")
  .get(checkToken, checkAdmin, getALLMovieScreenings)
  .post(checkToken, checkAdmin, postMovieScreening);
movieScreeningRouter
  .route("/admin/:movieIndex")
  .get(checkToken, checkAdmin, getSingleMovieScreening)
  .patch(checkToken, checkAdmin, updateMovieScreening)
  .delete(checkToken, checkAdmin, deleteMovieScreening);

//   export the Router:
export default movieScreeningRouter;

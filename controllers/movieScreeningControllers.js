import { Moviescreening } from "../models/movieScreeningModel.js";

// GET
const getALLMovieScreening = async (req, res, next) => {
  try {
    const movieScreenings = await Moviescreening.find();
    res.status(200).json(movieScreenings);
  } catch (err) {
    next(err);
  }
};

// POST

const postMovieScreening = async (req, res, next) => {
  try {
    const movieScreening = await Moviescreening.create(req.body);
    console.log(req.body);
    res.status(201).json(movieScreening);
  } catch (err) {
    next(err);
  }
};

// UPDATE
// DELETE

export { getALLMovieScreening, postMovieScreening };

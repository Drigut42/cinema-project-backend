import { Moviescreening } from "../models/movieScreeningModel.js";

// GET all movies with screening times
const getALLMovieScreenings = async (req, res, next) => {
  try {
    const movieScreenings = await Moviescreening.find();
    res.status(200).json(movieScreenings);
  } catch (err) {
    next(err);
  }
};

// GET a single movie with screening times

const getSingleMovieScreening = async (req, res, next) => {
  try {
    const movieScreening = await Moviescreening.findOne({
      movieIndex: req.params.movieIndex,
    });
    res.status(200).json(movieScreening);
  } catch (err) {
    next(err);
  }
};

// POST a movie with screening times

const postMovieScreening = async (req, res, next) => {
  try {
    const movieScreening = await Moviescreening.create(req.body);
    console.log(req.body);
    res.status(201).json(movieScreening);
  } catch (err) {
    next(err);
  }
};

// UPDATE one movie with screening times
const updateMovieScreening = async (req, res, next) => {
  try {
    const movieScreening = await Moviescreening.findOneAndUpdate(
      { movieIndex: req.params.movieIndex },
      req.body,
      { runValidators: true, new: true }
    );
    res.status(200).json(movieScreening);
  } catch (err) {
    next(err);
  }
};

// DELETE one movie with screening times

const deleteMovieScreening = async (req, res, next) => {
  try {
    const movieScreening = await Moviescreening.findOneAndDelete({
      movieIndex: req.params.movieIndex,
    });
    movieScreening ? res.status(200).json(movieScreening) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

export {
  getALLMovieScreenings,
  getSingleMovieScreening,
  postMovieScreening,
  updateMovieScreening,
  deleteMovieScreening,
};

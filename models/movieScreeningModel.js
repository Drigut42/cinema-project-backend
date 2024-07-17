import mongoose from "mongoose";

// Movie details object
//? default if movie details couldn't be fetched?
const movieDetailsSchema = new mongoose.Schema({
  title: { type: String },
  runtime: { type: String },
  genre: { type: String },
  director: { type: String },
  writer: { type: String },
  actors: { type: String },
  plot: { type: String, default: "Once upon a time..." },
  poster: {
    type: String,
    validate: {
      // URL validation
      // Allowed image formats: png, jpg, jpeg, gif
      validator: (v) => {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(v);
      },
      message: (props) => {
        return `${props.value} is not a valid URL!`;
      },
    },
  },
});

// Screening times object
const screeningTimesSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  visitors: { type: [{ id: String, visitor: String }], default: [] },
  revenue: { type: Number, default: 0 },
});

// Document for each movie: movie screening
const movieScreeningSchema = new mongoose.Schema({
  movieIndex: {
    type: Number,
    unique: true,
  },
  movieDetails: { type: movieDetailsSchema, required: true },
  screeningTimes: { type: [screeningTimesSchema], required: true },
});

const Moviescreening = mongoose.model("Moviescreening", movieScreeningSchema);

export { Moviescreening };

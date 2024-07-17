import mongoose from "mongoose";
import validator from "validator";

// Address Schema (optional)
// ---Validation---
// street & streetNr: only allows letters (a-z, A-Z), numbers (0-9) and whitespaces
// city: only allows letters (a-z, A-Z) and spaces
// postalCode: only allows using exactly 5 numbers
const streetValidator = {
  validator: (v) => {
    return /^[a-zA-Z0-9\s]+$/.test(v);
  },
  message: (props) =>
    `${props.value} is not valid. Please enter a valid input using only letters, numbers, and spaces.`,
};

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    validate: streetValidator,
  },
  streetNr: { type: String, validate: streetValidator },
  city: {
    type: String,
    validate: {
      validator: (v) => {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: (props) =>
        `${props.value} is not valid for city. Please enter a valid input using only letters and spaces.`,
    },
  },
  postalCode: {
    type: String,
    validate: {
      validator: (v) => {
        return /^[0-9]{5}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not valid for postalCode. Please enter a valid input using exactly 5 numbers.`,
    },
  },
});

// User Schema
// ---Validation---
// username, password and email are required
// username and email should be unique, trimmed (whitespaces removed from the beginning and end)
// username: Minimum length of 4 characters, maximum length of 20 characters, only allows letters (a-z, A-Z) and numbers (0-9)
// email: converted to lowercase, must be a valid email address
// password: Minimum length of 6 characters

// firstName & lastName: only allows letters, hyphens, apostrophes and spaces.
// profilePicture: only allows URL with image formats: png, jpg, jpeg, gif
// phoneNumber: only allows numbers

const nameValidator = {
  validator: (v) => {
    // `i` flag: case-insensitive
    return /^[a-zA-Z\-'\s]+$/i.test(v);
  },
  message: (props) =>
    `${props.value} is not valid! Please enter a valid input using only letters, hyphens, apostrophes and spaces.`,
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [4, "Username: Minlength is 4 characters"],
    maxlength: [20, "Username: Maxlength is 20 characters"],
    validate: {
      validator: (v) => {
        return validator.matches(v, /^[a-zA-Z0-9]+$/);
      },
      message: (props) =>
        `${props.value} is not valid. Please enter a valid input using only letters (a-z, A-Z) and numbers (0-9).`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, validate: nameValidator },
  lastName: { type: String, validate: nameValidator },
  profilePicture: {
    type: String,
    validate: {
      validator: (v) => {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(v);
      },
      message: (props) => {
        return `${props.value} is not a valid URL!`;
      },
    },
  },
  phoneNumber: {
    type: Number,
    trim: true,
    address: { type: addressSchema },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
});

const User = mongoose.model("User", userSchema);

export default User;

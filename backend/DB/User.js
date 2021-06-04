const mongoose = require("mongoose");

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
  },
  photo: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  dateOfBirth: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model("User", User);

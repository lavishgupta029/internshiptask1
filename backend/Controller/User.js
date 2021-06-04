const mongoose = require("mongoose");
const HttpError = require("../http-error");
const bcrypt = require("bcryptjs");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const SignUp = async (req, res, next) => {
  const { firstName, lastName, email, password, confirmpassword } = req.body;
  if (!firstName || !lastName || !email || !password || !confirmpassword) {
    const error = new HttpError("please enter all required fields", 500);
    return next(error);
  }
  if (confirmpassword != password) {
    const error = new HttpError("please Confirm with correct password", 500);
    return next(error);
  }
  if (password.length < 8) {
    const error = new HttpError("Enter password of minimum length 8", 500);
    return next(error);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (e) {
    const error = new HttpError("Signing up failed,please try again.", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("Email or Username already exist", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch {
    const error = new HttpError("Could not create user,please try again", 500);
    return next(error);
  }
  const createdUser = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Error while creating new user", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "4hr" }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signup failed,please try again.", 500);
    return next(error);
  }

  res.status(201).json({
    email: createdUser.email,
    userName: createdUser.userName,
    token: token,
  });
};
const Signin = async (req, res, next) => {
  const { signemail, signpassword } = req.body;

  if (!signemail || !signpassword) {
    const error = new HttpError("please enter all required fields", 500);
    return next(error);
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: signemail });
  } catch (e) {
    const error = new HttpError("Signing in failed,please try again.", 500);
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("Please Signin first", 401);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(signpassword, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in,please verify your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials,could not log you in.",
      401
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "4hr",
      }
    );
  } catch (err) {
    const error = new HttpError("Signin failed,please try again.", 500);
    return next(error);
  }

  res.status(201).json({
    email: existingUser.email,
    userName: existingUser.userName,
    token: token,
  });
};
const GetUser = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await User.findById(req.user.userId);
  } catch (err) {
    const error = new HttpError("Could Not find Employee User", 500);
    return next(error);
  }
  if (!existingUser) {
    return next(new HttpError("User does not exist", 400));
  }
  res.status(200).json(existingUser);
};
const UpdateUser = async (req, res, next) => {
  const { firstName, lastName, gender, dateOfBirth } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(req.user.userId);
  } catch (err) {
    const error = new HttpError("Could Not find Employee User", 500);
    return next(error);
  }
  if (!existingUser) {
    return next(new HttpError("User does not exist", 400));
  }
  if (req.body.email) {
    try {
      await User.findByIdAndUpdate(existingUser.id, {
        email: req.body.email,
      });
    } catch (err) {
      console.log(1, err);
      const error = new HttpError("Could Not Update employee", 500);
      return next(error);
    }
  }
  let profileImage;
  if (req.file) {
    profileImage = req.file.path;
  }
  // if (existingUser.photo !== (null || undefined) && profileImage) {
  //   fs.unlink(existingUser.photo, (err) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   });
  // }
  let user;
  try {
    user = await User.findByIdAndUpdate(
      req.user.userId,
      { photo: profileImage, firstName, lastName, gender, dateOfBirth },
      { new: true }
    );
  } catch (err) {
    const error = new HttpError("Could Not Update employee", 500);
    console.log(2, err);
    return next(error);
  }

  res.status(200).json({ user });
};
const UpdatePassword = async (req, res, next) => {
  const { newPassword, confirmPassword, oldPassword } = req.body;
  if (!newPassword || !oldPassword || !confirmPassword) {
    const error = new HttpError("Please enter required feilds", 500);
    return next(error);
  }
  if (newPassword != confirmPassword) {
    const error = new HttpError("Please confirm password correctly", 500);
    return next(error);
  }

  let existingUser;
  try {
    existingUser = await User.findById(req.user.userId);
  } catch (err) {
    const error = new HttpError("Could Not find Employee User", 500);
    return next(error);
  }
  if (!existingUser) {
    return next(new HttpError("User does not exist", 400));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(oldPassword, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in,please verify your credentials and try again.",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials,could not log you in.",
      401
    );
    return next(error);
  }

  let hashedpassword;
  try {
    hashedpassword = await bcrypt.hash(newPassword, 10);
  } catch (err) {
    const error = new HttpError(
      "Could not update password,please try again",
      500
    );
    return next(error);
  }

  let updatedUser;
  try {
    updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { password: hashedpassword },
      { new: true }
    );
  } catch (err) {
    const error = new HttpError(
      "Could not update password,please try again",
      500
    );
    return next(error);
  }
  res.status(200).json("Your Password has been updated");
};
exports.SignUp = SignUp;
exports.Signin = Signin;
exports.GetUser = GetUser;
exports.UpdateUser = UpdateUser;
exports.UpdatePassword = UpdatePassword;

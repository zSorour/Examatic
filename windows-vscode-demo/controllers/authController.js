const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const HttpError = require("../models/HTTPError");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");

module.exports.login = async (req, res, next) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    const error = new HttpError("Invalid Credentials", validationErrors, 422);
    return next(error);
  }

  const { username, password, role } = req.body;

  let user;

  try {
    if (role === "Student") {
      user = await Student.findOne({
        username: username.toLowerCase()
      }).select("+password");
    } else {
      user = await Instructor.findOne({
        username: username.toLowerCase()
      }).select("+password");
    }
  } catch (err) {
    const error = new HttpError(
      "Server Error",
      ["Failure to sign in, please try again later."],
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Invalid Credentials",
      ["Username or password are invalid."],
      401
    );
    return next(error);
  }

  let isCorrectPassword = false;
  try {
    isCorrectPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError(
      "Server Error",
      ["Failure to sign in, please try again later."],
      500
    );
    return next(error);
  }

  if (!isCorrectPassword) {
    const error = new HttpError(
      "Invalid Credentials",
      ["Username or password are invalid."],
      401
    );
    return next(error);
  }

  let token;

  const jwtPayload = {
    userID: user._id,
    username: user.username,
    role: role
  };

  const jwtSecret = process.env.JWT_SECRET;

  const jwtOptions = {
    expiresIn: "1h"
  };

  try {
    token = jwt.sign(jwtPayload, jwtSecret, jwtOptions);
  } catch (err) {
    const error = new HttpError(
      "Server Error",
      ["Failure to sign in, please try again later."],
      500
    );
    return next(error);
  }

  res.json({
    userId: user._id,
    username: user.username,
    token: token
  });
};

module.exports.register = async (req, res, next) => {
  const validationErrors = validationResult(req).array();
  if (validationErrors.length > 0) {
    const error = new HttpError(
      "Invalid Registration Data",
      validationErrors,
      422
    );
    return next(error);
  }

  const { role, username, name, password } = req.body;

  let user;

  try {
    if (role === "Student") {
      user = await Student.findOne({ username: username.toLowerCase() });
    } else {
      user = await Instructor.findOne({ username: username.toLowerCase() });
    }
  } catch (err) {
    const error = new HttpError(
      "Server Error",
      ["Failure to create account, please try again later."],
      500
    );
    return next(error);
  }

  if (user) {
    const error = new HttpError(
      "Registration Failure",
      ["An account already exists with the same username."],
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Server Error",
      ["Failure to create account, please try again later."],
      500
    );
    return next(error);
  }

  let newUser;
  if (role === "Student") {
    newUser = new Student({
      username: username.toLowerCase(),
      password: hashedPassword,
      name: name
    });
  } else {
    newUser = new Instructor({
      username: username.toLowerCase(),
      password: hashedPassword,
      name: name
    });
  }

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Server Error",
      ["Failure to create account, please try again later."],
      500
    );
    return next(error);
  }

  res.status(201).send({
    message: "Account created successfully"
  });
};

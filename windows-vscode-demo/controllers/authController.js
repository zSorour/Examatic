const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const HttpError = require("../models/HTTPError");
const Student = require("../models/Student");

module.exports.login = (req, res, next) => {
  const { username, password, role } = req.body;
};

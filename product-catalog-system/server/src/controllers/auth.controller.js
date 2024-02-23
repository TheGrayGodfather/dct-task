const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { CustomError, CustomValidationError } = require("../utils/error.utils");
const User = require("../models/user.model.js");
const { validationResult } = require("express-validator");

const authController = {};

/*
POST /api/auth/signup
auth: NO
access: NA
*/
authController.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomValidationError(errors.array(), 400));
  }

  const body = _.pick(req.body, ["name", "email", "password"]);

  try {
    const user = new User(body);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user?.password, salt);

    user.password = hashedPassword;

    const userCount = await User.countDocuments();

    if (!userCount) {
      user.role = "admin";
    }

    await user.save();

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    res.status(201).json({ token });
  } catch (err) {
    next(new CustomError(err.message));
  }
};

/*
POST /api/auth/login
auth: NO
access: NA
*/
authController.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomValidationError(errors.array(), 400));
  }

  const body = req.body;

  try {
    const user = await User.findOne({ email: body.email });

    if (!user) {
      next(new CustomError("invalid email or password", 404));
    }

    const checkValidPassword = await bcrypt.compare(
      body.password,
      user.password
    );

    if (!checkValidPassword) {
      return next(new CustomError("invalid email or password", 404));
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    res.json({ token });
  } catch (err) {
    next(new CustomError(err.message));
  }
};

/*
POST /api/auth/logout
auth: YES
access: private
*/
authController.logout = async (req, res, next) => {
  try {
    res.json({ token: "" });
  } catch (err) {
    next(new CustomError(err.message));
  }
};

module.exports = authController;

const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { CustomError, CustomValidationError } = require("../utils/error.utils");
const User = require("../models/user.model.js");
const { ROLES } = require("../config/constants.js");

const userController = {};

/*
POST /api/auth/signup
auth: NO
access: NA
*/
userController.signup = async (req, res, next) => {
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
userController.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomValidationError(errors.array(), 400));
  }

  const body = req.body;

  try {
    const user = await User.findOne({ email: body.email });

    if (!user) {
      return next(new CustomError("invalid email or password", 404));
    }

    const checkValidPassword = bcrypt.compare(body.password, user.password);

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
userController.logout = async (req, res, next) => {
  try {
    res.json({ token: "" });
  } catch (err) {
    next(new CustomError(err.message));
  }
};

/*
GET	/api/admin/users
auth: admin
access: NA
*/
userController.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: ROLES.ADMIN } }).select({
      password: 0,
    });
    res.json(users);
  } catch (err) {
    next(new CustomError(err.message));
  }
};

/*
DELETE /api/admin/users/delete/:userId
auth: admin
access: NA
*/

userController.deleteAUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const response = await User.findOneAndUpdate(
      { _id: userId, role: { $ne: ROLES.ADMIN } },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!response) {
      return next(new CustomError("user not fount", 404));
    }

    res.json({
      message: "user deleted successfully",
    });
  } catch (err) {
    next(new CustomError(err.message));
  }
};

/*
PUT /api/admin/users/restore/:userId
auth: admin
access: NA
*/

userController.restoreAUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const response = await User.findOneAndUpdate(
      { _id: userId, role: { $ne: ROLES.ADMIN } },
      { $set: { isDeleted: false } },
      { new: true }
    );

    if (!response) {
      return next(new CustomError("user not fount", 404));
    }

    res.json({
      message: "user restored successfully",
    });
  } catch (err) {
    next(new CustomError(err.message));
  }
};

/*
PUT	/api/admin/users/upgrade/:userId
auth: admin
access: NA
*/
userController.changeToModerator = async (req, res, next) => {
  const userId = req.params.userId

  try {
    const user = await User.findByIdAndUpdate(userId, {role: ROLES.MODERATOR}, {new: true})

    if(!user) {
      return next(new CustomError("user not found", 404))
    }
    
    res.json({message: "user promoted to moderator successfully"})
  } catch (err) {
    next(new CustomError(err.message));
  }
};

module.exports = userController;

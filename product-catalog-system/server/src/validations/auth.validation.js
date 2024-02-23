const User = require("../models/user.model");

const passwordValidation = {
  escape: true,
  isStrongPassword: {
    errorMessage:
      "minimum 8 charter, 1 lowercase, 1 uppercase, 1 number, 1 special character",
  },
};

const userValidationSchema = {
  name: {
    trim: true,
    escape: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "minimum three character required",
    },
  },
  email: {
    trim: true,
    normalizeEmail: true,
    escape: true,
    isEmail: {
      errorMessage: "valid email required",
    },
    custom: {
      options: async (email) => {
        try {
          const user = await User.findOne({ email });

          if (user) {
            throw new Error("email is already taken");
          }
        } catch (err) {
          throw new Error(err.message);
        }
      },
    },
  },
  password: passwordValidation,
};

const loginValidationSchema = {
  email: {
    trim: true,
    normalizeEmail: true,
    escape: true,
    isEmail: {
      errorMessage: "valid email required",
    }
  },
  password: passwordValidation,
};

module.exports = { userValidationSchema, loginValidationSchema };

const express = require("express")
const authController = require("../controllers/auth.controller.js")
const { authenticateUser } = require("../middlewares/auth.middleware.js")
const { checkSchema } = require("express-validator")
const { userValidationSchema, loginValidationSchema } = require("../validations/auth.validation.js")

const route = express.Router()

route.route("/signup").post(checkSchema(userValidationSchema), authController.signup)
route.route("/login").post(checkSchema(loginValidationSchema), authController.login)
route.route("/logout").get(authenticateUser, authController.logout)

module.exports = route
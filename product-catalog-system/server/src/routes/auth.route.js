const express = require("express")
const userController = require("../controllers/user.controller.js")
const { authenticateUser } = require("../middlewares/auth.middleware.js")
const { checkSchema } = require("express-validator")
const { userValidationSchema, loginValidationSchema } = require("../validations/auth.validation.js")

const route = express.Router()

route.route("/signup").post(checkSchema(userValidationSchema), userController.signup)
route.route("/login").post(checkSchema(loginValidationSchema), userController.login)
route.route("/logout").get(authenticateUser, userController.logout)

module.exports = route
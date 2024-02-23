const express = require("express")
const userController = require("../controllers/user.controller.js")
const { authenticateUser, authorizeUser } = require("../middlewares/auth.middleware.js")
const { ROLES } = require("../config/constants.js")
const route = express.Router()

route.use(authenticateUser)
route.route("/users").get(authorizeUser([ROLES.ADMIN]), userController.getAllUsers)
route.route("/users/delete/:userId").delete(authorizeUser([ROLES.ADMIN]), userController.deleteAUser)
route.route("/users/restore/:userId").put(authorizeUser([ROLES.ADMIN]), userController.restoreAUser)
route.route("/users/upgrade/:userId").put(authorizeUser([ROLES.ADMIN]), userController.changeToModerator)

module.exports = route
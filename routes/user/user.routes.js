const express = require("express")
const { addUser, getAllUser, updateUser, deleteUser, getUserById } = require("../../controllers/user-controller/user.controller")
const { addUserValidationRules } = require("../../validation_rules/user-validation/addUser.validation")
const { validateApi } = require("../../middlewares/validator")
const { auth } = require("../../middlewares/auth.guard")
const { updateUserValidationRules } = require("../../validation_rules/user-validation/updateUser.validation")

const userRoutes = express.Router()

userRoutes.post("/add-user", addUserValidationRules(), validateApi, addUser)

userRoutes.put("/update-user/:id", auth, updateUserValidationRules(), validateApi, updateUser)

userRoutes.delete("/delete-user/:id", auth, deleteUser)

userRoutes.post("/all-user", getAllUser)

userRoutes.get("/get-user/:id", auth, getUserById)

module.exports = { userRoutes }
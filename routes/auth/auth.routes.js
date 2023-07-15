const express = require("express")
const { login, forgotPassword, checkResetPasswordToken, resetPassword, logout, socialLoginCallback, socialFacebookLoginCallback, socialLogin, changePassword } = require("../../controllers/auth-controller/auth.controller")
const { loginValidationRules } = require("../../validation_rules/auth-validation/login.validation")
const { validateApi } = require("../../middlewares/validator")
const { forgotPasswordValidationRules } = require("../../validation_rules/auth-validation/forgotPassword.validation")
const { resetPasswordValidationRules } = require("../../validation_rules/auth-validation/resetPassword.validation")
const { auth } = require("../../middlewares/auth.guard");
const { changePasswordValidatonRules } = require("../../validation_rules/auth-validation/changePassword.validation")


const authRoutes = express.Router()

authRoutes.post("/login", loginValidationRules(), validateApi, login)

authRoutes.post("/forgot-password", forgotPasswordValidationRules(), validateApi, forgotPassword)

authRoutes.get("/check-reset-password", checkResetPasswordToken)

authRoutes.post("/reset-password", resetPasswordValidationRules(), validateApi, resetPassword)

authRoutes.get("/logout", auth, logout)

authRoutes.get("/google/callback", socialLoginCallback)

authRoutes.get("/facebook/callback", socialFacebookLoginCallback)

authRoutes.post("/change-password", auth, changePasswordValidatonRules(), validateApi, changePassword)

module.exports = { authRoutes }
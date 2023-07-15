const express = require("express")
const { userRoutes } = require("./user.routes")

const userIndex = express.Router()

userIndex.use('/', userRoutes)

module.exports = { userIndex }
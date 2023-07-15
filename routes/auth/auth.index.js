const express = require("express")
const { authRoutes } = require("./auth.routes")

const authIndex = express.Router()

authIndex.use("/", authRoutes)

module.exports = { authIndex }
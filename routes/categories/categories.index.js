const express = require("express")
const { categorieRoutes } = require("./categories.routes")

const categorieIndex = express.Router()

categorieIndex.use("/", categorieRoutes)

module.exports = { categorieIndex }
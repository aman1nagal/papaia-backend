const express = require("express")
const { brandRoutes } = require("./brand.routes")

const brandIndex = express.Router()

brandIndex.use("/", brandRoutes)

module.exports = { brandIndex }
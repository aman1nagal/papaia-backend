const express = require("express")
const { productRoutes } = require("./product.routes")

const productIndex = express.Router()

productIndex.use("/", productRoutes)

module.exports = { productIndex }
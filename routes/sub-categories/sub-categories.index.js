const express = require("express")
const { subCategorieRoutes } = require("./sub-categories.routes")

const SubCategorieIndex = express.Router()

SubCategorieIndex.use("/", subCategorieRoutes)

module.exports = { SubCategorieIndex }
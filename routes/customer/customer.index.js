const express = require("express")
const { customerRoutes } = require("./customer.routes")

const customerIndex = express.Router()

customerIndex.use('/', customerRoutes)

module.exports = { customerIndex }
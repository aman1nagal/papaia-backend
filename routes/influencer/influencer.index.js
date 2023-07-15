const express = require("express")
const { influencerRoutes } = require("./influencer.routes")

const influencerIndex = express.Router()

influencerIndex.use("/", influencerRoutes)

module.exports = { influencerIndex }
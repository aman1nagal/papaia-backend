const express = require("express")
const { auth } = require("../../middlewares/auth.guard")
const { validateApi } = require("../../middlewares/validator")
const { updateUserValidationRules } = require("../../validation_rules/user-validation/updateUser.validation")
const { updateInfluencer, deleteInfluencer, disableInfluencer, getAllInfluencer, getInfluencerById } = require("../../controllers/influencer-controller/influencer.controller")


const influencerRoutes = express.Router()

influencerRoutes.put("/update/:id", auth, updateUserValidationRules(), validateApi, updateInfluencer)

influencerRoutes.delete("/delete/:id", auth, deleteInfluencer)

influencerRoutes.put("/disable", auth, disableInfluencer)

influencerRoutes.post("/all", getAllInfluencer)

influencerRoutes.get("/get-influencer/:id", auth, getInfluencerById)

module.exports = { influencerRoutes }
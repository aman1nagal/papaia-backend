const express = require("express")
const { auth } = require("../../middlewares/auth.guard")
const { updateUserValidationRules } = require("../../validation_rules/user-validation/updateUser.validation")
const { validateApi } = require("../../middlewares/validator")
const { updateBrand, deleteBrand, disableBrand, getAllBrand, getBrandById } = require("../../controllers/brand-controller/brand.controller")
const brandRoutes = express.Router()

brandRoutes.put("/update/:id", auth, updateUserValidationRules(), validateApi, updateBrand)

brandRoutes.delete("/delete/:id", auth, deleteBrand)

brandRoutes.put("/disable", auth, disableBrand)

brandRoutes.post("/all", getAllBrand)

brandRoutes.get("/get-brand/:id", auth, getBrandById)

module.exports = { brandRoutes }
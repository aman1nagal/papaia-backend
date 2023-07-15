const express = require("express")
const { auth, categoriesPermission } = require("../../middlewares/auth.guard")
const { addCategories, updateCategories, deleteCategories, getAllCategories, getCategoriesById, disableCategories, getCategories } = require("../../controllers/categories-controller/categories.controller")
const { addCategoriesValidationRules } = require("../../validation_rules/categories-validation/addCategories.validation")
const { validateApi } = require("../../middlewares/validator")
const { updateCategoriesValidationRules } = require("../../validation_rules/categories-validation/updateCategories.validation")
const { uploadCategories } = require("../../services/fileUpload")

const categorieRoutes = express.Router()

categorieRoutes.post("/add-category", auth, categoriesPermission, uploadCategories.single('image'), addCategoriesValidationRules(), validateApi, addCategories)

categorieRoutes.put("/update-category/:id", auth, categoriesPermission, uploadCategories.single('image'), updateCategoriesValidationRules(), validateApi, updateCategories)

categorieRoutes.delete("/delete-category/:id", auth, categoriesPermission, deleteCategories)

categorieRoutes.post("/get-all-category", auth, categoriesPermission, getAllCategories)

categorieRoutes.get("/category-by-id/:id", auth, categoriesPermission, getCategoriesById)

categorieRoutes.put("/disable-category", auth, categoriesPermission, disableCategories)

categorieRoutes.get("/all-category", auth, categoriesPermission, getCategories)

module.exports = { categorieRoutes }
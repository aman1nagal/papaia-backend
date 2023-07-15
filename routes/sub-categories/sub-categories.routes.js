const express = require("express")
const { auth, categoriesPermission } = require("../../middlewares/auth.guard")
const { validateApi } = require("../../middlewares/validator")
const { addSubCategoriesValidationRules } = require("../../validation_rules/sub-categories-validation/addSubCategories.validation")
const { updateSubCategoriesValidationRules } = require("../../validation_rules/sub-categories-validation/updateSubCategories.validation")
const { addSubCategories, updateSubCategories, deleteSubCategories, getAllSubCategories, getSubCategoriesById, disableSubCategories, getSubCategories } = require("../../controllers/sub_categories-controller/sub-categories.controller")

const subCategorieRoutes = express.Router()

subCategorieRoutes.post("/add-sub-category", auth, categoriesPermission, addSubCategoriesValidationRules(), validateApi, addSubCategories)

subCategorieRoutes.put("/update-sub-category/:id", auth, categoriesPermission, updateSubCategoriesValidationRules(), validateApi, updateSubCategories)

subCategorieRoutes.delete("/delete-sub-category/:id", auth, categoriesPermission, deleteSubCategories)

subCategorieRoutes.post("/get-all-sub-category", auth, categoriesPermission, getAllSubCategories)

subCategorieRoutes.get("/sub-category-by-id/:id", auth, categoriesPermission, getSubCategoriesById)

subCategorieRoutes.put("/disable-sub-category", auth, categoriesPermission, disableSubCategories)

subCategorieRoutes.get("/all-sub-category", auth, categoriesPermission, getSubCategories)

module.exports = { subCategorieRoutes }
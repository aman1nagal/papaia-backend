const express = require("express")
const { auth } = require("../../middlewares/auth.guard")
const { validateApi } = require("../../middlewares/validator")
const { addProduct, updateProduct, deleteProduct, getAllProduct, getProductById, disableProduct, getProducts } = require("../../controllers/product-controller/product.controller")
const { addProductValidationRules } = require("../../validation_rules/product-validation/addProduct.validation")
const { updateProductValidationRules } = require("../../validation_rules/product-validation/updateProduct.validation")

const productRoutes = express.Router()

productRoutes.post("/add-product", auth, addProductValidationRules(), validateApi, addProduct)

productRoutes.put("/update-product/:id", auth, updateProductValidationRules(), validateApi, updateProduct)

productRoutes.delete("/delete-product/:id", auth, deleteProduct)

productRoutes.post("/get-all-product", auth, getAllProduct)

productRoutes.get("/product-by-id/:id", auth, getProductById)

productRoutes.put("/disable-product", auth, disableProduct)

productRoutes.get("/all", auth, getProducts)

module.exports = { productRoutes }
const express = require("express")
const { updateCustomer, deleteCustomer, getAllCustomer, getCustomerById, disableCustomer } = require("../../controllers/customer-controller/customer.controller")
const { auth } = require("../../middlewares/auth.guard")
const { updateUserValidationRules } = require("../../validation_rules/user-validation/updateUser.validation")
const { validateApi } = require("../../middlewares/validator")

const customerRoutes = express.Router()


customerRoutes.put("/update/:id", auth, updateUserValidationRules(), validateApi, updateCustomer)

customerRoutes.delete("/delete/:id", auth, deleteCustomer)

customerRoutes.put("/disable", auth, disableCustomer)

customerRoutes.post("/all", getAllCustomer)

customerRoutes.get("/get-customer/:id", auth, getCustomerById)

module.exports = { customerRoutes }
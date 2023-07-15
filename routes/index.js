const express = require("express")
const { userIndex } = require("./user/user.index")
const { authIndex } = require("./auth/auth.index")
const { categorieIndex } = require("./categories/categories.index")
const { SubCategorieIndex } = require("./sub-categories/sub-categories.index")
const { productIndex } = require("./product/product.index")
const { customerIndex } = require("./customer/customer.index")
const { brandIndex } = require("./brand/brand.index")
const { influencerIndex } = require("./influencer/influencer.index")

const indexRouter = express.Router()

indexRouter.use("/user", userIndex)
indexRouter.use("/auth", authIndex)
indexRouter.use("/category", categorieIndex)
indexRouter.use("/sub-category", SubCategorieIndex)
indexRouter.use("/product", productIndex)
indexRouter.use("/customer", customerIndex)
indexRouter.use("/brand", brandIndex)
indexRouter.use("/influencer", influencerIndex)

module.exports = { indexRouter }

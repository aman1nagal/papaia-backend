const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
    {

        sub_categories_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "sub-categories",
            required: true
        },
        product_name: {
            type: Map, of: String,
            required: true
        },
        price: {
            type: Number,
        },
        description: {
            type: Map, of: String,
            required: true
        },
        created_by: {
            type: String,
            default: null,
            required: false,
        },
        updated_by: {
            type: String,
            default: null,
            required: false,
        },
        is_disable: {
            type: Boolean,
            required: false,
            default: false
        },
        is_deleted: {
            type: Boolean,
            default: false,
            required: false,
        },
        deleted_by: {
            type: String,
            default: null,
            required: false,
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model("products", productSchema)

module.exports = { Product }
const { default: mongoose } = require("mongoose");

const categorieSchema = new mongoose.Schema(
    {
        categories_type: {
            type: Map, of: String,
            required: true,
        },
        image: {
            type: String
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

const Categories = mongoose.model("categories", categorieSchema)

module.exports = { Categories }
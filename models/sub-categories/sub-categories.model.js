const { default: mongoose } = require("mongoose");

const subCategorieSchema = new mongoose.Schema(
    {
        categories_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories",
            required: true
        },
        name: {
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

const SubCategories = mongoose.model("sub-categories", subCategorieSchema)

module.exports = { SubCategories }
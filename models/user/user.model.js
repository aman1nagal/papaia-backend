const { default: mongoose } = require("mongoose");
const { ENUMS } = require("../../constants/enum.constants");

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone_number: {
            type: String
        },
        password: {
            type: String,
        },
        confirm_password: {
            type: String,
        },
        select_role: {
            type: String,
            default: ENUMS.SELECT_ROLE.CUSTOMER,
            enum: [
                ENUMS.SELECT_ROLE.ADMIN,
                ENUMS.SELECT_ROLE.BRAND,
                ENUMS.SELECT_ROLE.INFLUENCER,
                ENUMS.SELECT_ROLE.CUSTOMER
            ],
        },
        auth_id: {
            type: String,
            required: false
        },
        token: {
            type: String,
            default: null,
            required: false
        },
        reset_password_token: {
            type: String,
            default: null,
            required: false,
        },
        reset_password_expiry_time: {
            type: Date,
            required: false,
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
        timestamps: true,
    }
)

const User = mongoose.model("users", userSchema)

module.exports = { User }
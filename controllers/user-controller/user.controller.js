const { RESPONSE_PAYLOAD_STATUS_SUCCESS, RESPONSE_STATUS_CODE_OK, RESPONSE_PAYLOAD_STATUS_ERROR, RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR, RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR, AUTH_USER_DETAILS } = require("../../constants/global.constants");
const bcrypt = require('bcrypt')
const { User } = require("../../models/user/user.model");
const { ObjectId } = require('mongodb');


// add user

const addUser = async (req, res) => {

    try {
        const { first_name, last_name, email, phone_number, password, select_role, confirm_password } = req.body;
        const newPassword = await bcrypt.hash(password, 12)
        const confirmPass = await bcrypt.hash(confirm_password, 12)
        if (password !== confirm_password) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PASSWORD_MISMATCH"),
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        const addUser = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number,
            password: newPassword,
            confirm_password: confirmPass,
            select_role: select_role,
            created_by: first_name
        })

        if (addUser) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("USERS_ADDED"),
                data: addUser,
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("USERS_NOT_ADDED"),
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        }
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload)
    }
}

// update profile

const updateUser = async (req, res) => {

    try {
        const { id } = req.params
        const { first_name, last_name, phone_number } = req.body
        const updateProfile = await User.findByIdAndUpdate(id,
            {
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number,
                updated_by: first_name
            },
            { new: true }
        )
        if (updateProfile) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("USER_UPDATED"),
                data: updateProfile,
                error: null
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: null,
                error: req.t("USER_NOT_UPDATE")
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        }
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload)
    }

}

// get all user

const getAllUser = async (req, res) => {

    try {

        const { search, sort, current_page, per_page } = req.body

        const current_page_f = current_page ? current_page : 1;
        const per_page_f = per_page ? per_page : 25;

        const search_by = search ? search : ""
        const sort_column = sort ? (sort.column ? sort.column : "_id") : "_id";
        const sort_column_key =
            sort_column === "first_name"
                ? "first_name"
                : sort_column === "last_name"
                    ? "last_name"
                    : sort_column === "email"
                        ? "email"
                        : sort_column === "phone_number"
                            ? "phone_number"
                            : sort_column === "select_role"
                                ? "select_role"
                                : "_id";

        const order_by = sort.order ? sort.order : -1
        const listUser = await User.aggregate([
            {
                $match: {
                    select_role: { $regex: `${search_by}`, $options: "i" },
                    is_deleted: false
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: (current_page_f - 1) * per_page_f },
                        { $limit: per_page_f },
                        { $sort: { [sort_column_key]: order_by } },
                    ],
                },
            },
            {
                $addFields: {
                    total: { $arrayElemAt: ["$metadata.total", 0] },
                    current_page: current_page_f,
                    per_page: per_page_f
                },
            },
            {
                $project: {
                    data: 1,
                    metaData: {
                        per_page: "$per_page",
                        total_page: { $ceil: { $divide: ["$total", per_page_f] } },
                        current_page: "$current_page",
                        total_count: "$total",
                    },
                }
            },
        ])

        if (listUser && listUser.length > 0) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("USERS_FOUND"),
                data: listUser[0],
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("USERS_NOT_FOUND"),
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        }
        return res.status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR).json(responsePayload)
    }
}

// delete user

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const { first_name } = req[AUTH_USER_DETAILS]
        const existingUser = await User.findById(id)
        if (!existingUser) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("USERS_NOT_FOUND"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        const deletedUser = await User.findByIdAndUpdate(id, {
            $set: {
                is_deleted: true,
                deleted_by: first_name
            }
        })
        if (deletedUser) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("USER_DELETED"),
                data: deletedUser,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("USER_NOT_DELETE"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload);
    }
}

// get user by id

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const _id = new ObjectId(id)
        const userList = await User.aggregate([
            {
                $match: {
                    _id: _id,
                    is_deleted: false
                },
            },
        ])
        if (userList.length) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("USERS_FOUND"),
                data: userList[0],
                error: null
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("USERS_NOT_FOUND")
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload);
    }
}

module.exports = { addUser, getAllUser, updateUser, deleteUser, getUserById }
const { RESPONSE_PAYLOAD_STATUS_SUCCESS, RESPONSE_STATUS_CODE_OK, RESPONSE_PAYLOAD_STATUS_ERROR, RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR, RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR, AUTH_USER_DETAILS } = require("../../constants/global.constants");
const { User } = require("../../models/user/user.model");
const { ObjectId } = require('mongodb');


// update customer

const updateCustomer = async (req, res) => {

    try {
        const { id } = req.params

        const { first_name, last_name, phone_number } = req.body

        const customer = await User.findById(id);

        if (customer && customer.select_role === "customer") {

            const updatedCustomer = await User.findByIdAndUpdate(id,
                {
                    first_name: first_name,
                    last_name: last_name,
                    phone_number: phone_number,
                    updated_by: first_name
                },
                { new: true }
            )
            if (updatedCustomer) {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                    message: req.t("CUSTOMER_UPDATED"),
                    data: updatedCustomer,
                    error: null
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
            else {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_ERROR,
                    message: null,
                    data: null,
                    error: req.t("CUSTOMER_NOT_UPDATE")
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: null,
                error: req.t("NOT_A_CUSTOMER")
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

//  delete Customer

const deleteCustomer = async (req, res) => {

    try {
        const { id } = req.params
        const { first_name } = req[AUTH_USER_DETAILS]
        const existingCustomer = await User.findById(id)
        if (!existingCustomer) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CUSTOMER_NOT_FOUND"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        const deletedCustomer = await User.findByIdAndUpdate(id, {
            $set: {
                is_deleted: true,
                deleted_by: first_name
            }
        }, { new: true })
        if (deletedCustomer) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("CUSTOMER_DELETED"),
                data: deletedCustomer,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CUSTOMER_NOT_DELETE"),
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

// disable customer

const disableCustomer = async (req, res) => {

    try {

        const { id } = req.body
        const disableCustomer = await User.findByIdAndUpdate(id,
            {
                is_disable: true,
            },
            { new: true }
        )
        if (disableCustomer) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("CUSTOMER_DISABLE"),
                data: disableCustomer,
                error: null,
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CUSTOMER_NOT_DISABLE"),
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

// get customer by id

const getCustomerById = async (req, res) => {

    try {
        const { id } = req.params
        const _id = new ObjectId(id)
        const customerList = await User.aggregate([
            {
                $match: {
                    _id: _id,
                    is_deleted: false,
                    is_disable: false
                },
            },
        ])
        if (customerList.length) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("CUSTOMER_FOUND"),
                data: customerList[0],
                error: null
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CUSTOMER_NOT_FOUND")
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

// get all customer

const getAllCustomer = async (req, res) => {

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

        const listCustomer = await User.aggregate([
            {
                $match: {

                    select_role: { $eq: "customer" },
                    first_name: { $regex: `${search_by}`, $options: "i" },
                    is_disable: false,
                    is_deleted: false,
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
        if (listCustomer && listCustomer.length > 0) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("CUSTOMER_FOUND"),
                data: listCustomer[0],
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CUSTOMER_NOT_FOUND"),
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


module.exports = { updateCustomer, deleteCustomer, disableCustomer, getCustomerById, getAllCustomer }
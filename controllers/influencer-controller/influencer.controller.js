const { RESPONSE_PAYLOAD_STATUS_SUCCESS, RESPONSE_STATUS_CODE_OK, RESPONSE_PAYLOAD_STATUS_ERROR, RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR, RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR, AUTH_USER_DETAILS } = require("../../constants/global.constants");
const { User } = require("../../models/user/user.model");
const { ObjectId } = require('mongodb');


// update influencer user

const updateInfluencer = async (req, res) => {

    try {

        const { id } = req.params

        const { first_name, last_name, phone_number } = req.body

        const user = await User.findById(id);

        if (user && user.select_role === "influencer") {

            const updatedInfluencer = await User.findByIdAndUpdate(id,
                {
                    first_name: first_name,
                    last_name: last_name,
                    phone_number: phone_number,
                    updated_by: first_name
                },
                { new: true }
            )
            if (updatedInfluencer) {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                    message: req.t("INFLUENCER_UPDATED"),
                    data: updatedInfluencer,
                    error: null
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
            else {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_ERROR,
                    message: null,
                    data: null,
                    error: req.t("INFLUENCER_NOT_UPDATE")
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: null,
                error: req.t("NOT_A_INFLUENCER")
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

//  delete influencer user

const deleteInfluencer = async (req, res) => {

    try {
        const { id } = req.params
        const { first_name } = req[AUTH_USER_DETAILS]

        const existingUser = await User.findById(id)

        if (!existingUser) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("INFLUENCER_NOT_FOUND"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        const deletedInfluencer = await User.findByIdAndUpdate(id, {
            $set: {
                is_deleted: true,
                deleted_by: first_name
            }
        }, { new: true })
        if (deletedInfluencer) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("INFLUENCER_DELETED"),
                data: deletedInfluencer,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("INFLUENCER_NOT_DELETE"),
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

// disable influencer user

const disableInfluencer = async (req, res) => {

    try {

        const { id } = req.body
        const disableInfluencer = await User.findByIdAndUpdate(id,
            {
                is_disable: true,
            },
            { new: true }
        )
        if (disableInfluencer) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("INFLUENCER_DISABLE"),
                data: disableInfluencer,
                error: null,
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("INFLUENCER_NOT_DISABLE"),
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

// get influencer user by id

const getInfluencerById = async (req, res) => {

    try {

        const { id } = req.params
        const _id = new ObjectId(id)
        const influencerList = await User.aggregate([
            {
                $match: {
                    _id: _id,
                    is_deleted: false,
                    is_disable: false
                }
            }
        ])
        if (influencerList.length) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("INFLUENCER_FOUND"),
                data: influencerList[0],
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("INFLUENCER_NOT_FOUND")
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR
        }
        return res.status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR).json(responsePayload)
    }
}

// get all influencer user

const getAllInfluencer = async (req, res) => {

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

        const listInfluencer = await User.aggregate([
            {
                $match: {
                    select_role: { $eq: "influencer" },
                    first_name: { $regex: `${search_by}`, $options: "i" },
                    is_deleted: false,
                    is_disable: false
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

        if (listInfluencer && listInfluencer.length > 0) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("INFLUENCER_FOUND"),
                data: listInfluencer[0],
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("INFLUENCER_NOT_FOUND"),
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

module.exports = { updateInfluencer, deleteInfluencer, disableInfluencer, getInfluencerById, getAllInfluencer }

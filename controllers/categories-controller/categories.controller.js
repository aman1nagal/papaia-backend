const { RESPONSE_PAYLOAD_STATUS_SUCCESS, RESPONSE_STATUS_CODE_OK, RESPONSE_PAYLOAD_STATUS_ERROR, RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR, RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR, AUTH_BRAND_DETAILS, AUTH_USER_DETAILS } = require("../../constants/global.constants");
const { Categories } = require("../../models/categories/categories.model");
const { ObjectId } = require('mongodb');


// add categories

const addCategories = async (req, res) => {

    try {

        const { categories_type, image } = req.body
        const { first_name } = req[AUTH_USER_DETAILS]

        const categoriesObj = {

            categories_type: JSON.parse(categories_type),
            image: image,
            created_by: first_name
        }

        if (req.file) {

            const addCategorie = await Categories.create(categoriesObj)

            if (addCategorie) {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                    message: req.t("CATEGORY_ADDED"),
                    data: addCategorie,
                    error: null,
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
            else {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_ERROR,
                    message: null,
                    data: {},
                    error: req.t("CATEGORY_NOT_ADDED"),
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CATEGORY_NOT_IN_REQ_FILE"),
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
        return res.status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR).json(responsePayload);
    }
}

// update categories

const updateCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name } = req[AUTH_USER_DETAILS]

        const { categories_type, image } = req.body;

        const categoriesObj = {
            categories_type: JSON.parse(categories_type),
            image: image,
            updated_by: first_name
        };

        if (req.file) {

            const updatedCategories = await Categories.findByIdAndUpdate(id,
                categoriesObj,
                { new: true }
            )

            if (updatedCategories) {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                    message: req.t("CATEGORY_UPDATED"),
                    data: updatedCategories,
                    error: null,
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
            else {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_ERROR,
                    message: null,
                    data: {},
                    error: req.t("CATEGORY_NOT_UPDATED"),
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CATEGORY_NOT_IN_REQ_FILE"),
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
        return res.status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR).json(responsePayload);
    }
}

// delete categories

const deleteCategories = async (req, res) => {

    try {

        const { id } = req.params
        const { first_name } = req[AUTH_USER_DETAILS]
        const deletedCategories = await Categories.findByIdAndUpdate(id, {
            is_deleted: true,
            deleted_by: first_name
        })
        if (deletedCategories) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("CATEGORY_DELETED"),
                data: deletedCategories,
                error: null,
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CATEGORY_NOT_DELETED"),
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

// get categories

const getAllCategories = async (req, res) => {

    try {

        const { search, sort, current_page, per_page } = req.body

        const current_page_f = current_page ? current_page : 1;
        const per_page_f = per_page ? per_page : 25;

        const search_by = search ? search : ""
        const sort_column = sort ? (sort.column ? sort.column : "_id") : "_id";
        const sort_column_key =
            sort_column === "categories_type"
                ? "categories_type"
                : "_id";

        const order_by = sort.order ? sort.order : -1

        const language = req.headers.testlanguage
        const languageF = language ? language : "en"
        let a_categories_type = `categories_type.${languageF}`

        const listCategories = await Categories.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_disable: false,
                    $or: [
                        { [a_categories_type]: { $regex: `${search_by}`, $options: "i" } },
                    ],
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
        if (listCategories && listCategories.length > 0) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("CATEGORY_FOUND"),
                data: listCategories[0],
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CATEGORY_NOT_FOUND")
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

// get categories by id

const getCategoriesById = async (req, res) => {
    try {
        const { id } = req.params
        const _id = new ObjectId(id)
        const categoriesList = await Categories.aggregate([
            {
                $match: {
                    _id: _id,
                    is_deleted: false
                },
            },
        ])
        if (categoriesList.length) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("CATEGORY_FOUND"),
                data: categoriesList[0],
                error: null
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CATEGORY_NOT_FOUND")
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

// disable categories

const disableCategories = async (req, res) => {

    try {

        const { id } = req.body
        const disableCategories = await Categories.findByIdAndUpdate(id, {
            is_disable: true,
        }, { new: true })
        if (disableCategories) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("CATEGORY_DISABLE"),
                data: disableCategories,
                error: null,
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CATEGORY_NOT_DISABLE"),
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


// get all categories

const getCategories = async (req, res) => {

    try {

        const listCategories = await Categories.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_disable: false,
                }
            },
        ])
        if (listCategories) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("CATEGORY_FOUND"),
                data: listCategories,
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("CATEGORY_NOT_FOUND")
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

module.exports = { addCategories, updateCategories, deleteCategories, getAllCategories, getCategoriesById, disableCategories, getCategories }
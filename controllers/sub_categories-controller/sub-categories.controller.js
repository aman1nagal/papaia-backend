const { RESPONSE_PAYLOAD_STATUS_SUCCESS, RESPONSE_STATUS_CODE_OK, RESPONSE_PAYLOAD_STATUS_ERROR, RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR, RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR, AUTH_USER_DETAILS } = require("../../constants/global.constants");
const { Categories } = require("../../models/categories/categories.model");
const { SubCategories } = require("../../models/sub-categories/sub-categories.model");
const { ObjectId } = require('mongodb');

// add sub categories

const addSubCategories = async (req, res) => {

    try {
        const { name, categories_id } = req.body
        const { first_name } = req[AUTH_USER_DETAILS]

        if (categories_id) {
            const category = await Categories.findById(categories_id)
            if (!category) {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_ERROR,
                    message: null,
                    data: null,
                    error: req.t("CATEGORIES_ID_NOT_MATCH"),
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
        }
        const addSubCategorie = await SubCategories.create({
            name: name,
            categories_id: categories_id,
            created_by: first_name
        })

        if (addSubCategorie) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("SUB_CATEGORY_ADDED"),
                data: addSubCategorie,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("SUB_CATEGORY_NOT_ADDED"),
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

// update sub categories

const updateSubCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name } = req[AUTH_USER_DETAILS]
        const { name } = req.body;

        const updatedSubCategories = await SubCategories.findByIdAndUpdate(id,
            {
                name: name,
                updated_by: first_name
            },
            { new: true }
        )
        if (updatedSubCategories) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("SUB_CATEGORY_UPDATED"),
                data: updatedSubCategories,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("SUB_CATEGORY_NOT_UPDATED"),
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

// delete sub categories

const deleteSubCategories = async (req, res) => {

    try {

        const { id } = req.params
        const { first_name } = req[AUTH_USER_DETAILS]

        const deletedSubCategories = await SubCategories.findByIdAndUpdate(id, {
            is_deleted: true,
            deleted_by: first_name
        })

        if (deletedSubCategories) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("SUB_CATEGORY_DELETED"),
                data: deletedSubCategories,
                error: null,
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("SUB_CATEGORY_NOT_DELETED"),
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

// get all sub categories

const getAllSubCategories = async (req, res) => {

    try {

        const { search, sort, current_page, per_page } = req.body

        const current_page_f = current_page ? current_page : 1;
        const per_page_f = per_page ? per_page : 25;

        const search_by = search ? search : ""
        const sort_column = sort ? (sort.column ? sort.column : "_id") : "_id";
        const sort_column_key =
            sort_column === "name"
                ? "name"
                : "_id";

        const order_by = sort.order ? sort.order : -1

        const language = req.headers.testlanguage
        const languageF = language ? language : "en"
        let a_name = `name.${languageF}`

        const listSubCategories = await SubCategories.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_disable: false,
                    $or: [
                        { [a_name]: { $regex: `${search_by}`, $options: "i" } },
                    ],
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categories_id",
                    foreignField: "_id",
                    as: 'categories'
                }
            },
            {
                $unwind: '$categories',
            },
            {
                $project: {
                    _id: 1,
                    categories_id: 1,
                    name: 1,
                    created_by: 1,
                    updated_by: 1,
                    is_disable: 1,
                    is_deleted: 1,
                    deleted_by: 1,
                    __v: 1,
                    'categories._id': 1,
                    'categories.categories_type': 1,
                    'categories.image': 1,
                    'categories.created_by': 1,
                    'categories.createdAt': 1,
                    'categories.updatedAt': 1
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
        if (listSubCategories && listSubCategories.length > 0) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("SUB_CATEGORY_FOUND"),
                data: listSubCategories[0],
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("SUB_CATEGORY_NOT_FOUND"),
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

// get get sub categories by id

const getSubCategoriesById = async (req, res) => {
    try {
        const { id } = req.params
        const _id = new ObjectId(id)
        const subCategoriesList = await SubCategories.aggregate([
            {
                $match: {
                    _id: _id,
                    is_deleted: false
                },
            },
        ])
        if (subCategoriesList.length) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("SUB_CATEGORY_FOUND"),
                data: subCategoriesList[0],
                error: null
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("SUB_CATEGORY_NOT_FOUND")
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

// disable sub-categories

const disableSubCategories = async (req, res) => {

    try {

        const { id } = req.body
        const disableSubCategories = await SubCategories.findByIdAndUpdate(id, {
            is_disable: true,
        }, { new: true })
        if (disableSubCategories) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("SUB_CATEGORY_DISABLE"),
                data: disableSubCategories,
                error: null,
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("SUB_CATEGORY_NOT_DISABLE"),
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

// get sub categories

const getSubCategories = async (req, res) => {

    try {

        const listSubCategories = await SubCategories.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_disable: false,
                }
            },
        ])
        if (listSubCategories) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("SUB_CATEGORY_FOUND"),
                data: listSubCategories,
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("SUB_CATEGORY_NOT_FOUND"),
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

module.exports = { addSubCategories, updateSubCategories, deleteSubCategories, getAllSubCategories, getSubCategoriesById, disableSubCategories,getSubCategories }
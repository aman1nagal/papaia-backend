const { AUTH_USER_DETAILS, RESPONSE_PAYLOAD_STATUS_SUCCESS, RESPONSE_STATUS_CODE_OK, RESPONSE_PAYLOAD_STATUS_ERROR, RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR, RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR } = require("../../constants/global.constants");
const { Product } = require("../../models/product/product.model");
const { ObjectId } = require('mongodb');
const { SubCategories } = require("../../models/sub-categories/sub-categories.model");

// add product

const addProduct = async (req, res) => {

    try {

        const { first_name } = req[AUTH_USER_DETAILS]
        const { sub_categories_id, product_name, price, description } = req.body

        if (sub_categories_id) {
            const subCategory = await SubCategories.findById(sub_categories_id)
            if (!subCategory) {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_ERROR,
                    message: null,
                    data: null,
                    error: req.t("SUB_CATEGORIES_ID_NOT_MATCH"),
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
        }

        const addProduct = await Product.create({
            sub_categories_id: sub_categories_id,
            product_name: product_name,
            price: price,
            description: description,
            created_by: first_name
        })

        if (addProduct) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("PRODUCT_ADDED"),
                data: addProduct,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PRODUCT_NOT_ADDED"),
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

// update poduct

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name } = req[AUTH_USER_DETAILS]
        const { sub_categories_id, product_name, price, description } = req.body


        const updatedProduct = await Product.findByIdAndUpdate(id,
            {
                sub_categories_id: sub_categories_id,
                product_name: product_name,
                price: price,
                description: description,
                updated_by: first_name
            },
            { new: true }
        )
        if (updatedProduct) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("PRODUCT_UPDATED"),
                data: updatedProduct,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PRODUCT_NOT_UPDATED"),
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

// delete product

const deleteProduct = async (req, res) => {

    try {

        const { id } = req.params
        const { first_name } = req[AUTH_USER_DETAILS]

        const deletedProduct = await Product.findByIdAndUpdate(id, {
            is_deleted: true,
            deleted_by: first_name
        })

        if (deletedProduct) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("PRODUCT_DELETED"),
                data: deletedProduct,
                error: null,
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PRODUCT_NOT_DELETED"),
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

// get all product

const getAllProduct = async (req, res) => {
    try {
        const { search, sort, current_page, per_page } = req.body;

        const current_page_f = current_page ? current_page : 1;
        const per_page_f = per_page ? per_page : 25;

        const search_by = search ? search : "";
        const sort_column = sort ? (sort.column ? sort.column : "_id") : "_id";
        const sort_column_key =
            sort_column === "product_name"
                ? "product_name"
                : sort_column === "price"
                    ? "price"
                    : sort_column === "description"
                        ? "description"
                        : "_id";

        const order_by = sort.order ? sort.order : -1;

        const language = req.headers.testlanguage
        const languageF = language ? language : "en"
        let a_product_name = `product_name.${languageF}`

        const listProduct = await Product.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_disable: false,
                    $or: [
                        { [a_product_name]: { $regex: `${search_by}`, $options: "i" } },
                    ],
                }
            },
            {
                $lookup: {
                    from: "sub-categories",
                    localField: "sub_categories_id",
                    foreignField: "_id",
                    as: "sub_category",
                },
            },
            {
                $lookup: {
                    from: "sub-categories",
                    let: { sub_categories_id: "$sub_categories_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$sub_categories_id"] } } },
                        {
                            $project: {
                                _id: 1,
                                categories_id: 1,
                                name: 1,
                                created_by: 1,
                                createdAt: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                    as: "sub_category",
                },
            },
            {
                $project: {
                    _id: 1,
                    sub_categories_id: 1,
                    product_name: 1,
                    price: 1,
                    description: 1,
                    created_by: 1,
                    updated_by: 1,
                    is_disable: 1,
                    is_deleted: 1,
                    deleted_by: 1,
                    __v: 1,
                    sub_category: { $arrayElemAt: ["$sub_category", 0] },
                },
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
                    per_page: per_page_f,
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
                },
            },
        ]);

        if (listProduct && listProduct.length > 0) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("PRODUCT_FOUND"),
                data: listProduct[0],
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        } else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PRODUCT_NOT_FOUND"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    } catch (err) {
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
};

// get product by id

const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const _id = new ObjectId(id)
        const productList = await Product.aggregate([
            {
                $match: {
                    _id: _id,
                    is_deleted: false
                },
            },
        ])
        if (productList.length) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("PRODUCT_FOUND"),
                data: productList[0],
                error: null
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PRODUCT_NOT_FOUND"),
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

// disable product

const disableProduct = async (req, res) => {

    try {

        const { id } = req.body
        const disableProducts = await Product.findByIdAndUpdate(id, {
            is_disable: true,
        }, { new: true })
        if (disableProducts) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("PRODUCT_DISABLE"),
                data: disableProducts,
                error: null,
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PRODUCT_NOT_DISABLE"),
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

// get all products

const getProducts = async (req, res) => {

    try {

        const listProducts = await Product.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_disable: false,
                }
            },
        ])
        if (listProducts) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("PRODUCT_FOUND"),
                data: listProducts,
                error: null
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PRODUCT_NOT_FOUND")
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


module.exports = { addProduct, updateProduct, deleteProduct, getAllProduct, getProductById, disableProduct, getProducts }
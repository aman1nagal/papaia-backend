const { checkSchema } = require("express-validator")
const { languages } = require("../../translate/languages.validation");

const updateProductValidationRules = () => {

    const getErrorMessage = (language, key) => {
        return languages[language]?.[key] || languages.en[key];
    };

    return checkSchema({

        sub_categories_id: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "SUB_CATEGORIES_ID_REQUIRED");
                },
            },
        },
        product_name: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "PRODUCT_NAME_REQUIRED");
                },
            },
        },
        price: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "PRODUCT_PRICE_REQUIRED");
                },
            },
        },
        description: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "PRODUCT_DESCRIPTION_REQUIRED");
                },
            },
        },
    })
}

module.exports = { updateProductValidationRules }
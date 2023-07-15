const { checkSchema } = require("express-validator")
const { languages } = require("../../translate/languages.validation");

const addCategoriesValidationRules = () => {

    const getErrorMessage = (language, key) => {
        return languages[language]?.[key] || languages.en[key];
    };

    return checkSchema({

        categories_type: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "CATEGORY_TYPE_REQUIRED");
                },
            },
        },
        image: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "CATEGORY_IMAGE_REQUIRED");
                },
            }
        }
    })
}

module.exports = { addCategoriesValidationRules }
const { checkSchema } = require("express-validator")
const { languages } = require("../../translate/languages.validation");

const updateSubCategoriesValidationRules = () => {

    const getErrorMessage = (language, key) => {
        return languages[language]?.[key] || languages.en[key];
    };

    return checkSchema({

        name: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "SUB_CATEGORY_NAME_REQUIRED");
                },
            },
        },
    })
}

module.exports = { updateSubCategoriesValidationRules }
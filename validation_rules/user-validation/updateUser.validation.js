const { checkSchema } = require("express-validator");
const { languages } = require("../../translate/languages.validation");

const updateUserValidationRules = () => {

    const getErrorMessage = (language, key) => {
        return languages[language]?.[key] || languages.en[key];
    };

    return checkSchema({
        first_name: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "FIRST_NAME_REQUIRED");
                },
            },
        },
        last_name: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "LAST_NAME_REQUIRED");
                },
            },
        },
        phone_number: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "PHONE_NUMBER_REQUIRED");
                },
            },
        },
    });
};

module.exports = { updateUserValidationRules };

const { checkSchema } = require("express-validator");
const { languages } = require("../../translate/languages.validation");

const changePasswordValidatonRules = () => {

    const getErrorMessage = (language, key) => {
        return languages[language]?.[key] || languages.en[key];
    };

    return checkSchema({
        old_password: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "OLD_PASSWORD_REQUIRED");
                },
            },
        },
        new_password: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "NEW_PASSWORD_REQUIRED");
                },
            },
            matches: {
                options: [/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/],
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "IN_VALID_PASSWORD_TYPE");
                },
            },
        },
        confirm_password: {
            notEmpty: {
                errorMessage: (value, { req }) => {
                    const language = req.headers['testlanguage'] || "en";
                    return getErrorMessage(language, "CONFIRM_PASSWORD");
                },
            },
            custom: {
                options: (value, { req }) => {
                    if (value !== req.body.new_password) {
                        const language = req.headers['testlanguage'];
                        const errorMessage = getErrorMessage(language, "IN_VALID_CONFIRM_PASSWORD");
                        return Promise.reject({
                            errorMessage,
                        });
                    }
                    return true;
                },
            },
        },
    })
}

module.exports = { changePasswordValidatonRules }
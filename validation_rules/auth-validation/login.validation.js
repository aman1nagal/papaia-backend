const { checkSchema } = require("express-validator");
const { languages } = require("../../translate/languages.validation");

const loginValidationRules = () => {

  const getErrorMessage = (language, key) => {
    return languages[language]?.[key] || languages.en[key]
  }

  return checkSchema({
    email: {
      notEmpty: {
        errorMessage: (value, { req }) => {
          const language = req.headers['testlanguage'] || "en";
          return getErrorMessage(language, "EMAIL_ERROR_EMPTY");
        },
      },
      isEmail: {
        errorMessage: (value, { req }) => {
          const language = req.headers['testlanguage'] || "en";
          return getErrorMessage(language, "EMAIL_ERROR_INVALID");
        },
      },
    },
    password: {
      notEmpty: {
        errorMessage: (value, { req }) => {
          const language = req.headers['testlanguage'] || "en";
          return getErrorMessage(language, "PASSWORD_ERROR_EMPTY");
        },
      },
    },
  });
};

module.exports = { loginValidationRules };

const { checkSchema } = require("express-validator");
const { languages } = require("../../translate/languages.validation");

const forgotPasswordValidationRules = () => {

  const getErrorMessage = (language, key) => {
    return languages[language]?.[key] || languages.en[key];
  };

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
  });
};

module.exports = { forgotPasswordValidationRules };

const { checkSchema } = require("express-validator");
const { languages } = require("../../translate/languages.validation");

const resetPasswordValidationRules = () => {

  const getErrorMessage = (language, key) => {
    return languages[language]?.[key] || languages.en[key];
  };

  return checkSchema({
    reset_password_token: {
      notEmpty: {
        errorMessage: (value, { req }) => {
          const language = req.headers['testlanguage'] || "en";
          return getErrorMessage(language, "TOKEN_REQUIRED");
        },
      },
    },
    new_password: {
      notEmpty: {
        errorMessage: (value, { req }) => {
          const language = req.headers['testlanguage'] || "en";
          return getErrorMessage(language, "PASSWORD_ERROR_EMPTY");
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
  });
};

module.exports = { resetPasswordValidationRules };

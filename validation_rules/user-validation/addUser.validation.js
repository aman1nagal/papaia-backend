const { checkSchema } = require("express-validator");
const { User } = require("../../models/user/user.model");
const { languages } = require("../../translate/languages.validation");

const addUserValidationRules = () => {

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

    email: {
      notEmpty: {
        errorMessage: (value, { req }) => {
          const language = req.headers['testlanguage'] || "en";
          return getErrorMessage(language, "EMAIL_REQUIRED");
        },
      },
      isEmail: {
        errorMessage: (value, { req }) => {
          const language = req.headers['testlanguage'] || "en";
          return getErrorMessage(language, "EMAIL_INVALID");
        },
      },
      custom: {
        options: (value, { req }) =>
          User.find({ email: value }).then((user) => {
            if (user.length > 0) {
              const language = req.headers['testlanguage'];
              const errorMessage = getErrorMessage(language, "EMAIL_ALREADY_EXISTS");
              // console.log("errrrrmesssss", email.errorMessage);
              return Promise.reject({
                errorMessage,
              });
            }
          }),
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

    password: {
      notEmpty: {
        errorMessage: (value, { req }) => {
          const language = req.headers['testlanguage'] || "en";
          return getErrorMessage(language, "PASSWORD_REQUIRED");
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
          if (value !== req.body.password) {
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

  });
};

module.exports = { addUserValidationRules };

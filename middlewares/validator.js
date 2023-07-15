const { validationResult } = require("express-validator");
const {
    RESPONSE_PAYLOAD_STATUS_ERROR,
    RESPONSE_STATUS_CODE_VALIDATION_ERROR,
} = require("../constants/global.constants");

// validation result

const validateApi = (req, res, next) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
        return next();
    }
    const extractedErrors = {};
    error
        .array({ onlyFirstError: true })
        .map((err) => (extractedErrors[err.path] = err.msg));
    const responsePayload = {
        status: RESPONSE_PAYLOAD_STATUS_ERROR,
        message: null,
        data: null,
        error: extractedErrors,
    };
    return res
        .status(RESPONSE_STATUS_CODE_VALIDATION_ERROR)
        .json(responsePayload);
};

module.exports = { validateApi };

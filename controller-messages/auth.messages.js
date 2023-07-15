const AUTH_MESSAGES = {

    LOGIN_SUCCESSFUL: "Log-in successfull.",
    LOGIN_FAILED: "Log-in failed.",

    LOGOUT_SUCCESSFUL: "Log-out successfull.",
    LOGOUT_FAILED: "Log-out failed.",

    USER_NOT_FOUND: "User does not exists sorry.",
    LOGIN_UN_SUCCESSFUL_WITHOUT_PASSWORD: "Please set your password before logging in.",

    INVALID_EMAIL: "Invalid Email",
    INVALID_PASSWORD: "Invalid Password.",

    URL_CORRECT: "Your Link to reset password is valid.",
    URL_EXPIRED: "Your Link to reset password is expired.",
    LINK_INCORRECT: "Your Link to reset password is incorrect.",

    INVITE_URL_CORRECT: "Your Link to set password is valid.",
    INVITE_URL_EXPIRED: "Your invitation code is expired.",
    INVITE_LINK_INCORRECT: "Your invitation code is incorrect.",

    EMAIL_SENT: "Check your mail box the link has been shared to change password.",

    PASSWORD_RESET_SUCCESSFULLY: "Reset password successfull.",
    PASSWORD_RESET_UN_SUCCESSFULLY: "Can not reset password.",
    CURRENT_PASSWORD_INVALID: "Current password is invalid",

    INITIAL_PASSWORD_SETUP_SUCCESS: "Password setup successfull",
    INITIAL_PASSWORD_SETUP_ERROR: "Password setup un-successfull",

    PASSWORD_CHANGE_SUCCESSFULLY: "change password successfull.",
    PASSWORD_CHANGE_UN_SUCCESSFULLY: "can't update new password",
    PASSWORD_MISMATCH: "New password and confirm password do not match.",

    EMAIL_ERROR_MISSING: "Email is missing.",
    EMAIL_ERROR_EMPTY: "Email is empty.",
    EMAIL_ERROR_INVALID: "Invalid email address.",
    EMAIL_UNIQUE: "Email must be unique",

    NAME_MISSING: "Name is missing",
    NAME_EMPTY: "Name is empty",

    PASSWORD_ERROR_MISSING: "Password is missing",
    PASSWORD_ERROR_EMPTY: "Password is empty",
    
    PASSWORD_LENGTH: "Password enter min 6 length",
    IN_VALID_PASSWORD_TYPE: "Password must contain 1 digit, 1 uppercase, 1 special must be between 6 to 15 character.",

    OLD_PASSWORD_REQUIRED: "Please enter the old password.",
    NEW_PASSWORD_REQUIRED: "Please enter the 4 digit password.",

    CONFIRM_PASSWORD: "Confirm Password field is required.",
    IN_VALID_CONFIRM_PASSWORD: "Confirm password does not match with the password.",

    TOKEN_INVALID: "Your token is invalid",
    TOKEN_REQUIRED: "Please enter the valid token",

    ADMIN_AND_BRAND_ACCESS: "Only the admin and brand can access it.",
};

module.exports = { AUTH_MESSAGES };

const axios = require("axios")
const bcrypt = require('bcrypt')
const { RESPONSE_PAYLOAD_STATUS_SUCCESS, RESPONSE_STATUS_CODE_OK, RESPONSE_PAYLOAD_STATUS_ERROR, RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR, RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR, AUTH_USER_DETAILS } = require("../../constants/global.constants");
const { comparePasswordHash, addLogInToken, addResetPasswordToken } = require("../../helpers/fn");
const { User } = require("../../models/user/user.model");
const { authService } = require("../../services/auth.service");


// login

const login = async (req, res) => {

    try {
        const { email, password } = req.body

        const user = await User.findOne(
            {
                email: { $regex: email, $options: "i" },
            },
            {
                token: 0,
                confirm_password: 0,
                reset_password_expiry_time: 0,
                reset_password_token: 0,
                is_disable: 0,
                is_deleted: 0,
                updated_at: 0,
                updated_by: 0,
                created_by: 0,
                deleted_by: 0,
                created_at: 0,
                createdAt: 0,
                updatedAt: 0
            })
        if (user) {
            if (user.password !== null) {
                const passwordHash = user.password
                const isValidPassword = await comparePasswordHash(password, passwordHash)
                if (isValidPassword) {
                    const userObj = user.toJSON();
                    delete userObj.password
                    const tokenObj = {
                        _id: userObj._id,
                        email: userObj.email,
                        name: userObj.name,
                    };
                    const token = authService.generateToken(tokenObj);
                    await User.findOneAndUpdate(
                        { _id: user._id },
                        { $set: { token: token } }
                    );
                    const responsePayload = {
                        status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                        message: req.t("LOGIN_SUCCESSFUL"),
                        data: { token, userObj },
                        error: null,
                    };
                    return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
                }
                else {
                    const responsePayload = {
                        status: RESPONSE_PAYLOAD_STATUS_ERROR,
                        message: null,
                        data: {},
                        error: req.t("INVALID_PASSWORD"),
                    };
                    return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
                }
            }
            else {
                const responsePayload = {

                    status: RESPONSE_PAYLOAD_STATUS_ERROR,
                    message: null,
                    data: {},
                    error: req.t("PASSWORD_ERROR_EMPTY"),
                };
                return res
                    .status(RESPONSE_STATUS_CODE_OK)
                    .json(responsePayload);
            }
        }
        else {
            const responsePayload = {

                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("INVALID_EMAIL"),
            };
            return res
                .status(RESPONSE_STATUS_CODE_OK)
                .json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload);
    }
}

// forgot password

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const userObj = await User.findOne({ email: email });
        if (userObj) {
            const user = userObj.toJSON();
            const token = authService.generateTokenForgotPassword(email, user.id)
            await addResetPasswordToken(token, email);
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("EMAIL_SENT"),
                data: null,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("USERS_NOT_FOUND"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res.status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR).json(responsePayload);
    }
};

// check reset password token

const checkResetPasswordToken = async (req, res) => {
    try {
        const { token } = req.body;
        const checked = await User.findOne({
            reset_password_token: token,
            reset_password_expiry_time: { $gte: new Date() },
        });
        if (checked) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("URL_CORRECT"),
                data: null,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("LINK_INCORRECT"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload);
    }
};

// reset password

const resetPassword = async (req, res) => {
    try {
        const { reset_password_token, new_password, confirm_password } = req.body;
        if (new_password !== confirm_password) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PASSWORD_MISMATCH"),
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        const user = await User.findOneAndUpdate(
            {
                reset_password_token: reset_password_token,
            },
            {
                password: await bcrypt.hash(new_password, 12),
                confirm_password: await bcrypt.hash(confirm_password, 12),
                reset_password_token: null,
            }
        );
        if (user) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("PASSWORD_RESET_SUCCESSFULLY"),
                data: null,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("TOKEN_INVALID"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload);
    }
};

// logout

const logout = async (req, res) => {
    try {
        const { email } = req[AUTH_USER_DETAILS];
        const loggedOut = await User.findOneAndUpdate(
            { email: email },
            { token: null },
            { new: true }
        );
        if (loggedOut) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("LOGOUT_SUCCESSFUL"),
                data: null,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        } else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("LOGOUT_FAILED"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    } catch (error) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload);
    }
};

// google login

const socialLoginCallback = async (req, res) => {
    try {

        const { accessToken } = req.body

        // Use the access token to fetch user information
        const userInfoUrl = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
        const headers = { Authorization: `Bearer ${accessToken}` };

        const userInfoResponse = await axios.get(userInfoUrl, { headers });
        let user = userInfoResponse.data;

        let existingUser = await User.findOne({ auth_id: user?.id });

        // login --------- if user already exist 
        if (existingUser) {

            const token = accessToken
            await User.findOneAndUpdate(
                { _id: existingUser._id },
                { $set: { token: token } },
                { email: existingUser.email },
                { last_login: new Date() }
            );

            existingUser.token = token;

            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("LOGIN_SUCCESSFUL"),
                data: existingUser,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            // register --------- if user new create 
            const userObj = {
                auth_id: user.id,
                first_name: user.given_name,
                last_name: user.family_name,
                email: user.email,
                created_by: user.given_name
            }

            var userCreate = await User.create(userObj)

            const tokenObj = {
                _id: userCreate._id,
                email: userCreate.email,
                name: userCreate.name,
            };

            const token = authService.generateToken(tokenObj);
            await addLogInToken(token, userCreate._id);
            await User.findOneAndUpdate({ email: userCreate.email }, { last_login: new Date() });

            userCreate.token = token;

            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("LOGIN_SUCCESSFUL"),
                data: userCreate,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload);
    }
}

// facebook login

const socialFacebookLoginCallback = async (req, res) => {
    try {

        const { accessToken } = req.body

        // Use the access token to fetch user information
        const userInfoUrl = `https://graph.facebook.com/v13.0/me?access_token=${accessToken}&fields=id,name,email`;

        const fields = "id,first_name,last_name,email";
        const userInfoResponse = await axios.get(userInfoUrl,
            {
                headers: {
                    'Accept': 'text/plain'
                }
            },
            {
                params: {
                    fields: fields,
                    access_token: accessToken,
                }
            },
        );

        const user = userInfoResponse.data;

        let existingUser = await User.findOne({ auth_id: user?.id });

        // login ------ if already user exists

        if (existingUser) {

            const token = accessToken
            await User.findOneAndUpdate(
                { _id: existingUser._id },
                { $set: { token: token } },
                { email: existingUser.email },
                { last_login: new Date() }
            );

            existingUser.token = token;

            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("LOGIN_SUCCESSFUL"),
                data: existingUser,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        else {
            // register ------- if user is not exists new user create

            const userObj = {
                auth_id: user.id,
                first_name: user.name.split(' ')[0],
                last_name: user.name.split(' ')[1],
                email: user.email || "",
                created_by: user.name.split(' ')[0],
            };

            const userCreate = await User.create(userObj);

            const tokenObj = {
                _id: userCreate._id,
                email: userCreate.email,
                name: userCreate.name,
            };

            const token = authService.generateToken(tokenObj);
            await addLogInToken(token, userCreate._id);
            await User.findOneAndUpdate(
                { email: userCreate.email },
                { last_login: new Date() }
            );

            userCreate.token = token;

            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                message: req.t("LOGIN_SUCCESSFUL"),
                data: userCreate,
                error: null,
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload);
    }
};

// change password

const changePassword = async (req, res) => {

    try {
        const { _id } = req[AUTH_USER_DETAILS]
        const { old_password, new_password, confirm_password } = req.body

        if (new_password !== confirm_password) {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("PASSWORD_MISMATCH"),
            }
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
        const user = await User.findOne({ _id: _id })
        if (user) {
            const passwordHash = user.password
            const isValidPassword = await comparePasswordHash(old_password, passwordHash)
            if (isValidPassword) {
                const encryptedPassword = await bcrypt.hash(new_password, 12)
                const confirmEncryptedPassword = await bcrypt.hash(confirm_password, 12)
                const changePassword = await User.findByIdAndUpdate(
                    { _id },
                    {
                        password: encryptedPassword,
                        confirm_password: confirmEncryptedPassword,
                        token: null
                    },
                    { new: true }
                )
                if (changePassword) {
                    const responsePayload = {
                        status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
                        message: req.t("PASSWORD_CHANGE_SUCCESSFULLY"),
                        data: null,
                        error: null,
                    }
                    return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload)
                }
                else {
                    const responsePayload = {
                        status: RESPONSE_PAYLOAD_STATUS_ERROR,
                        message: null,
                        data: {},
                        error: req.t("PASSWORD_RESET_UN_SUCCESSFULLY"),
                    };
                    return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
                }
            }
            else {
                const responsePayload = {
                    status: RESPONSE_PAYLOAD_STATUS_ERROR,
                    message: null,
                    data: {},
                    error: req.t("CURRENT_PASSWORD_INVALID"),
                };
                return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
            }
        }
        else {
            const responsePayload = {
                status: RESPONSE_PAYLOAD_STATUS_ERROR,
                message: null,
                data: {},
                error: req.t("INVALID_PASSWORD"),
            };
            return res.status(RESPONSE_STATUS_CODE_OK).json(responsePayload);
        }
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        };
        return res
            .status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR)
            .json(responsePayload);
    }
}


module.exports = { login, forgotPassword, checkResetPasswordToken, resetPassword, logout, socialLoginCallback, socialFacebookLoginCallback, changePassword }

const bcrypt = require("bcrypt");
const { AUTH_USER_DETAILS } = require("../constants/global.constants");
const { User } = require("../models/user/user.model");
const { forgotPasswordMailer } = require("../services/mailer/login.forgot.mailer");
const { ENUMS } = require("../constants/enum.constants");
const saltRounds = process.env.SALT_ROUNDS;


// hash password

const passwordHash = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, parseInt(saltRounds), (err, hash) => {
            if (err) {
                return reject(err);
            }
            return resolve(hash);
        });
    });
};

// compare password 

const comparePasswordHash = (password, hash) => {
    return new Promise((resolve) => {
        bcrypt.compare(password, hash).then((isValid) => {
            if (isValid) {
                return resolve(isValid);
            }
            return resolve(isValid);
        });
    });
};

// get current login user

const getCurrentLoginUser = async (req) => {
    let userData = req[AUTH_USER_DETAILS];
    let user = userData._id;
    return user;
};

// add login token

const addLogInToken = async (token, id) => {

    try {
        let user = await User.findOneAndUpdate({ _id: id }, { $set: { token: token } });
    }
    catch (err) {
        console.log("err", err);
    }
};

// add reset password token

const addResetPasswordToken = async (token, email) => {

    try {
        const dt = new Date();
        dt.setHours(dt.getHours() + 2);
        await forgotPasswordMailer(token, email)
        return User.findOneAndUpdate({ email: email },
            {
                reset_password_token: token,
                reset_password_expiry_time: dt,
            }
        );
    }
    catch (err) {
        console.log("err", err);
    }
};

// checkColumn

const checkColumn = (
    model,
    field,
    value,
    successMsg,
    errorMsg,
    type,
    is_case_insensitive
) => {
    if (is_case_insensitive) {
        value = { $regex: `^${value}$`, $options: "i" };
    }
    return new Promise((resolve, reject) => {
        model
            .find({ [field]: value })
            .then((data) => {
                if (type == ENUMS.VALIDATION_TYPE.UNIQUE) {
                    if (data.length <= 0) {
                        resolve(successMsg);
                    } else {
                        reject(errorMsg);
                    }
                } else if (type == ENUMS.VALIDATION_TYPE.EXISTS) {
                    if (data.length > 0) {
                        resolve(successMsg);
                    } else {
                        reject(errorMsg);
                    }
                }
            })
            .catch((err) => {
                reject(errorMsg);
            });
    });
};

module.exports = { passwordHash, comparePasswordHash, getCurrentLoginUser, addLogInToken, checkColumn, addResetPasswordToken }

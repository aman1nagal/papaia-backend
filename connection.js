const db = require("./config/database");
const bcrypt = require("bcrypt");
const userData = require("./helpers/admin.json");
const { User } = require("./models/user/user.model");
const { RESPONSE_PAYLOAD_STATUS_SUCCESS, RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR, RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR } = require("./constants/global.constants");

try {
    db()
        .then(() => console.log("Database connected..."))
        .catch((err) => console.log("ERROR", err));
}
catch (err) {
    console.error("Error in connection", err);
}

const addAdmin = async (req, res) => {
    try {
        await userData.forEach(async (user) => {
            const existUser = await User.find({ email: user.email });
            if (existUser.length > 0) {
                return;
            }
            else {
                const newPassword = await bcrypt.hash(user.password, 12);
                const addedUser = await User.create({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    password: newPassword,
                    phone_number: user.phone_number,
                    select_role: user.select_role
                });
                if (addedUser) {
                    console.log("User created");
                }
            }
        })
    }
    catch (err) {
        const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_SUCCESS,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
        }
        return res.status(RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR).json(responsePayload)
    }
}

addAdmin()
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const {
  RESPONSE_PAYLOAD_STATUS_ERROR,
  RESPONSE_STATUS_MESSAGE_AUTHORIZATION_ERROR,
  RESPONSE_STATUS_CODE_AUTHORIZATION_ERROR,
  RESPONSE_STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_CODE_INTERNAL_SERVER_ERROR,
  AUTH_USER_DETAILS,
} = require("../constants/global.constants");
const { User } = require("../models/user/user.model");
const { ENUMS } = require("../constants/enum.constants");
const { AUTH_MESSAGES } = require("../controller-messages/auth.messages");


// create middleware to check whether the user is valid or not

const auth = async (req, res, next) => {

  try {

    if (req.headers && req.headers.authorization) {
      const authArray = req.headers.authorization.split(" ");
      if (authArray && authArray.length > 0 && authArray[1]) {
        const token = authArray[1];
        const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
        const userObj = await User.findOne({
          _id: decodedToken._id,
          email: decodedToken.email,
          token: token,
        });
        if (userObj) {
          const user = userObj.toJSON();
          req[AUTH_USER_DETAILS] = user;
          return next();
        }
        else {
          const responsePayload = {
            status: RESPONSE_PAYLOAD_STATUS_ERROR,
            message: null,
            data: null,
            error: RESPONSE_STATUS_MESSAGE_AUTHORIZATION_ERROR,
          };
          return res
            .status(RESPONSE_STATUS_CODE_AUTHORIZATION_ERROR)
            .json(responsePayload);
        }
      }
      else {
        const responsePayload = {
          status: RESPONSE_PAYLOAD_STATUS_ERROR,
          message: null,
          data: null,
          error: RESPONSE_STATUS_MESSAGE_AUTHORIZATION_ERROR,
        };
        return res
          .status(RESPONSE_STATUS_CODE_AUTHORIZATION_ERROR)
          .json(responsePayload);
      }
    }
    else {
      const responsePayload = {
        status: RESPONSE_PAYLOAD_STATUS_ERROR,
        message: null,
        data: null,
        error: RESPONSE_STATUS_MESSAGE_AUTHORIZATION_ERROR,
      };
      return res
        .status(RESPONSE_STATUS_CODE_AUTHORIZATION_ERROR)
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
};

// create permission for category and sub-category management

const categoriesPermission = async (req, res, next) => {

  try {

    const { select_role } = req[AUTH_USER_DETAILS]

    if (
      select_role === ENUMS.SELECT_ROLE.ADMIN ||
      select_role === ENUMS.SELECT_ROLE.BRAND
    ) {
      return next()
    }
    else {
      const responsePayload = {
        status: RESPONSE_PAYLOAD_STATUS_ERROR,
        message: null,
        data: null,
        error: AUTH_MESSAGES.ADMIN_AND_BRAND_ACCESS,
      };
      return res.status(RESPONSE_STATUS_CODE_AUTHORIZATION_ERROR).json(responsePayload);
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
}

module.exports = { auth, categoriesPermission };

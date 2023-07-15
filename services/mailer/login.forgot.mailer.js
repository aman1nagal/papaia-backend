const handlebars = require("handlebars");
const fs = require("fs");
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: process.env.SERVICE,
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});

// forgot Password Mail send 

const forgotPasswordMailer = async (code, email) => {

    try {

        let url = `${process.env.REACT_APP_BASE_URL}/reset-password`
        const emailTemplateSource = fs.readFileSync("./views/mails/resetPassword.hbs", "utf8");
        const template = handlebars.compile(emailTemplateSource);
        const htmlToSend = template({ urlorcode: `${url}/${code}` });

        let info = await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: `${email}`,
            subject: `Reset Password.`,
            text: "Password Reset",
            html: htmlToSend
        })

        console.log("info--------------------------", info);
        console.log("Message sent: %s************************", info.messageId);
        console.log(
            "Preview URL: %s-------------------",
            nodemailer.getTestMessageUrl(info)
        );

    }
    catch (err) {
        console.error("err", err);
    }
}


module.exports = {
    forgotPasswordMailer
}
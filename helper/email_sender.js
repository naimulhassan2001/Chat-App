require('dotenv').config();
const nodemailer = require("nodemailer");

const helper = {};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAI_APP_PASSWORD,
  },
});

helper.sendMail = async (info) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const subject =
      info.type === "verification"
        ? "Email verification code"
        : "Forgot password code";

    const message = `
          <h1>Hello, ${info.name}</h1>
          <p>Your One Time Code is <h3>${otp}</h3> to verify your account</p>
          <small>This Code is valid for ${process.env.OTP_EXPIRY_TIME} minutes</small>
        `;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: info.email,
      subject: subject,
      html: message,
    };

    console.log(mailOptions);
    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent %s", response);
    return otp;
  } catch (error) {
    console.error("Error sending mail", error);
    throw error;
  }
};

module.exports = helper;




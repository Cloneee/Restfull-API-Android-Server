const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIl_PASS,
  },
});


const sendOTP = (email, otpCode) => {
  const option = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "My Note OTP",
    html: `Your OTP code is <b>${otpCode}</b>`,
  };
  return new Promise((resolve) =>{
    transporter.sendMail(option, (err, info) => {
      if (err) {
        return resolve(false);
      }
      return resolve(true);
    });
  })
};

module.exports = { sendOTP };

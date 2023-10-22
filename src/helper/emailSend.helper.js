const nodemailer = require("nodemailer");
const { SMTP_USER_NAME, SMTP_PASSWORD } = require("../secret");

/* 
    transproter made with nodemailer
*/
const transproter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER_NAME,
    pass: SMTP_PASSWORD,
  },
});

/* 
    a function that sends an email
*/
exports.sendEmailWithNodemailer = async (emailData) => {
  try {
    //mail options
    const mailOptions = {
      from: SMTP_USER_NAME,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };

    //send the email
    await transproter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

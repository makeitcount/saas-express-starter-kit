"use strict";
exports.init = init;
exports.sendEmail = sendEmail;

const nodemailer = require("nodemailer");

var envImportResult = require("dotenv").config({
    path: "./config/" + (process.env.NODE_ENV || "production") + ".env"
  });
  if (envImportResult.error) {
    throw envImportResult.error;
  }
const configs = envImportResult.parsed;

var EmailTransporter;

/**
 * Initializes email service, sends a test email to a test email(on ethereal)
 */
async function init() {
  if(EmailTransporter) return;
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  // WARNING: This is only for testing(development server) for now.
  // For production use, you may want to use services such as Amazon SES, Mailgun, etc.
  // Available email services - https://nodemailer.com/transports/
  EmailTransporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send test mail with defined transport object
  let info = await EmailTransporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Test email: email service works ✔", // Subject line
    text: "Email service works?  Yes", // plain text body
    html: "<b>Email service works? Yes</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

init().catch(console.error);


/**
 * Function to send 
 * @param {*} message 
 * @param {*} options 
 */
async function sendEmail(message, options){
    let info = await EmailTransporter.sendMail({
        to: options.to,
        from: options.from || configs.DEFAULT_FROM_EMAIL,
        subject: options.subject || ("Update from "+configs.SITE_TITLE),
        text: message
    })
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
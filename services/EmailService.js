"use strict";
exports.init = init;
exports.sendEmail = sendEmail;
exports.alertAdmin = alertAdmin;
exports.alertUser = alertUser;

// Library to send email
const nodemailer = require("nodemailer");
// Library to create templates
var consolidate = require('consolidate');
const TEMPLATE_LANGUAGE = "ejs";
const DEFAULT_CONTEXT_DATA_OBJECT = { 
  websiteUrl: process.env.SITE_DOMAIN_URL,
  websiteTitle: process.env.SITE_TITLE,
  brandColorPrimary: process.env.BRAND_COLOR_PRIMARY,
  socialYoutubeUrl: process.env.SOCIAL_YOUTUBE_URL,
  socialTwitterUrl: process.env.SOCIAL_TWITTER_URL,
  socialLinkedinUrl: process.env.SOCIAL_LINKEDIN_URL,
  message: "" 
};
// Library to convert html email to plain-text email
var htmlToText = require('nodemailer-html-to-text').htmlToText;

var EmailTransporter;

const EMAIL_TEMPLATES = {
  "admin.alert": "views/email-templates/admin/alert/html.ejs",
  "user.alert": "views/email-templates/user/alert/html.ejs",
  "admin.useractivity.feedback": "views/email-templates/admin/useractivity/feedback/html.ejs",
  "admin.request.accountdeletion": "views/email-templates/admin/request/accountdeletion/html.ejs",
  "user.activity": "views/email-templates/user/activity/html.ejs"
}

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
  // Convert html to plain text if plain-text content not provided
  EmailTransporter.use('compile', htmlToText())

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
 * Function to send emails
 * @param {String} category email category e.g. `admin.request.accountdeletion`. this helps in getting the right template and logic.
 * @param {Object} contextData data required to fill the template
 * @param {Object} emailOptions { to, from, subject, text }
 * @example sendEmail()
 */
async function sendEmail(category, contextData, emailOptions){
  let finalEmailOptions = emailOptions || {};
  if(!finalEmailOptions.to){
    console.warn("No email address to send email. Make sure to provide it in options.to param");
  }
  if(!finalEmailOptions.from){
    finalEmailOptions.from = process.env.DEFAULT_FROM_EMAIL;
  }
  if(!finalEmailOptions.subject){
    finalEmailOptions.subject = "Update from "+process.env.SITE_TITLE;
  }
  // Create html email if not already provided
  if(!emailOptions.html && category && EMAIL_TEMPLATES[category]){
    // Compile html email from the template using consolidate library
  let finalEmailOptions = emailOptions || {};
    finalEmailOptions.html = await consolidate[TEMPLATE_LANGUAGE](EMAIL_TEMPLATES[category], Object.assign(DEFAULT_CONTEXT_DATA_OBJECT, contextData));
  }
  if(!finalEmailOptions.html && !finalEmailOptions.text){
    console.warn("No message to send email. Make sure to add message param under options.text or options.html");
  }
  let info = await EmailTransporter.sendMail(finalEmailOptions)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

/**
 * A simple fn to send alert emails to admin. A quick to use sendEmail wrapper.
 * @param {*} message 
 */
async function alertAdmin(message){
  await sendEmail('admin.alert', { message: message }, {
    text: message,
    subject: extractSubjectFromMessage(message),
    to: process.env.ADMIN_EMAIL
  });
}

/**
 * A simple fn to send alert emails to user. A quick to use sendEmail wrapper.
 * @param {*} message 
 */
async function alertUser(email, message){
  await sendEmail('user.alert', { message: message }, {
    text: message,
    subject: extractSubjectFromMessage(message),
    to: email
  });
}

/**
 * Creates subject from the message
 */
function extractSubjectFromMessage(message){
  let maxLength = 50; // maximum number of chars to extract
  // Trim the string to the maximum length
  var subject = message.substr(0, maxLength);
  // We don't want to cut the words from in between so re-trim if we are in the middle of a word
  subject = subject.substr(0, Math.min(subject.length, subject.lastIndexOf(" ")))
  return subject.length < maxLength ? ("⚠️ " + subject) : ("⚠️ " + subject + "...")
}
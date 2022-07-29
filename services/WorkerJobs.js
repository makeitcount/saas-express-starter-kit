/**
 * @file Job definitions for workers
 */

exports.sendEmail = sendEmail;

const EmailService = require('./EmailService');

function sendEmail(emailOptions){
    EmailService.sendEmailNow(emailOptions)
}
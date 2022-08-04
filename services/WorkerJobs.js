/**
 * @file Job definitions for workers. 
 * Define your new job functions here and make sure to add it to the list JOB_PROCESSOR_MAP in WorkerService.js
 */

exports.sendEmail = sendEmail;


/**
 * Job to send email
 * @param {*} emailOptions 
 */
function sendEmail(emailOptions){
    const EmailService = require('./EmailService');
    EmailService.sendEmailNow(emailOptions)
}
const nodemailer = require("nodemailer");


let transport = nodemailer.createTransport({
    host: process.env.smtp_host,
    port: process.env.smtp_port,
    secure: false,
    auth: 
    {
        user: process.env.smtp_user,
        pass: process.env.smtp_pass
    },
    tls:{
        ciphers:"SSLv3"
    }
});

/**
 * 
 * @param {Email Sender Name} senderName 
 * @param {Sender Email Address} senderEmail 
 * @param {Receiver Email Address} receiverEmail 
 * @param {Subject of the Email} subject 
 * @param {html content of email. htmlContent is being used as text also} htmlContent 
 * @returns Promise
 */

exports.sendMail = async (senderName,senderEmail,receiverEmail,subject,htmlContent) => {

    return new Promise((resolve,reject)=>{

        mailOptions = {
            from: `"${senderName}" <${senderEmail}>`,
            to: receiverEmail,
            subject: subject,
            text: htmlContent,
            html: htmlContent,
        };
        
        transport.sendMail(mailOptions, (error, info) => {

            if (error)
            {
                reject({message:"Email service unavailable",code:503});
            }
            else
            {
                console.log('Successfully sent');
                resolve('Successfully sent');
            }
        });

    });

}
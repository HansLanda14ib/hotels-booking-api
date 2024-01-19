const nodemailer = require('nodemailer');

const sendEmailEthereal = async (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // use SSL
        auth: {
            user: 'hilton.doyle72@ethereal.email',
            pass: 'WQeSH4XPmZX8fUvk7p'
        }, tls: {
            rejectUnauthorized: false
        }
    });

    let info = await transporter.sendMail({
        from: '"Hotels Booking Admin" <bibzazne@gmail.com>',
        to: to,
        subject: subject,
        html: message
    });
    console.log('Message sent: %s', info.messageId);

};

module.exports = {sendEmailEthereal};
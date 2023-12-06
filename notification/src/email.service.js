const nodemailer = require('nodemailer');

const sendEmailEthereal = async (to, subject, message) => {
    // let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'loyal33@ethereal.email',
            pass: 'PspxPYqkkTfNJ13AMt'
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
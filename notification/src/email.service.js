const nodemailer = require('nodemailer');

const sendEmailEthereal = async (to, subject, message) => {
    // let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'milo48@ethereal.email',
            pass: '3s3B5ekTVg2uh7JEzj'
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
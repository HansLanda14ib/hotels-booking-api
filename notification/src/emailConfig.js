const dotenv = require('dotenv');

dotenv.config();



module.exports = {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    ses: {
        from: {
            // replace with actual email address
            default: '"Booking Hotels Admin" <bibzazne@gmail.com>',
        },
        // e.g. us-west-2
        region: 'us-east-1'
    }
};
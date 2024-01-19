const dotenv = require('dotenv');

dotenv.config();



module.exports = {
    ses: {
        from: {
            // replace with actual email address
            default: '"Booking Hotels Admin" <bibzazne@gmail.com>',
        },
        // e.g. us-west-2
        region: 'us-east-1'
    }
};
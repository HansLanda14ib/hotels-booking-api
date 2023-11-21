const express = require('express');
const router = express.Router();
const {authorizePermissions, decodeToken} = require('./middleware/authentication')

const {
    getAllBooking,
    getSingleBooking,
    updateBooking,
    deleteBooking,
    getCustomerBookings,
    getHotelBookings
} = require('./bookingController');


module.exports = router;

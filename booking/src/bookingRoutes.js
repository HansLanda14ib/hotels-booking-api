const express = require('express');
const router = express.Router();
const {authorizePermissions, isAuthenticate} = require('./middleware/authentication')

const {
    getAllBooking,
    getSingleBooking,
    updateBooking,
    deleteBooking,
    getCustomerBookings,
    getHotelBookings
} = require('./bookingController');

router
    .route('/admin')
    .get([isAuthenticate, authorizePermissions('admin')], getAllBooking)

router
    .route('/admin/:id')
    .patch([isAuthenticate, authorizePermissions('admin')], updateBooking)
    .delete([isAuthenticate, authorizePermissions('admin')], deleteBooking)

router
    .get('/', isAuthenticate, getCustomerBookings)

router
    .route('/owner')
    .get([isAuthenticate, authorizePermissions('owner')], getHotelBookings)


module.exports = router;

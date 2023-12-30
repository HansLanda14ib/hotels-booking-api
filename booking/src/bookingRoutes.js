const express = require('express');
const router = express.Router();
const {
    authorizePermissions,
    authenticateJWTToken,
    authenticateFirebaseToken,
} = require('./middleware/authentication')

const {
    getAllBooking,
    getSingleBooking, bookedHotels,
    updateBooking,
    deleteBooking,
    getCustomerBookings,
    createBooking
} = require('./bookingController');
router.route('/bookedHotels').get(bookedHotels)
router
    .route('/admin')
    .get([authenticateFirebaseToken, authorizePermissions('admin')], getAllBooking)

router
    .route('/admin/:id')
    .patch([authenticateFirebaseToken, authorizePermissions('admin')], updateBooking)
    .delete([authenticateFirebaseToken, authorizePermissions('admin')], deleteBooking)

router
    .get('/', authenticateFirebaseToken, getCustomerBookings)


router.route('/create').post(
    authenticateJWTToken,
    createBooking)

module.exports = router;

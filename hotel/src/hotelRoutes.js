const express = require('express');
const router = express.Router();
const {authenticateUser, authorizePermissions} = require('./middleware/authentication')

const {
    createHotel, getAllHotels, updateHotel, deleteHotel, getSingleHotel
} = require('./hotelController');

router
    .route('/')
    .post([authenticateUser, authorizePermissions('admin')], createHotel)
    .get(getAllHotels);

router
    .route('/:id')
    .get(getSingleHotel)
    .patch([authenticateUser, authorizePermissions('admin')], updateHotel)
    .delete([authenticateUser, authorizePermissions('admin')], deleteHotel)


module.exports = router;

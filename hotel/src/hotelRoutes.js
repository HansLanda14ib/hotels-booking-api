const express = require('express');
const router = express.Router();
const {authorizePermissions, decodeToken} = require('./middleware/authentication')

const {
    createHotel, getAllHotels, updateHotel, deleteHotel, getSingleHotel, availableHotels
} = require('./hotelController');

router
    .route('/')
    .post([decodeToken, authorizePermissions('admin', 'owner')], createHotel)
    .get(getAllHotels);

router.route('/available').get(availableHotels)

router
    .route('/:id')
    .get(getSingleHotel)
    .patch([decodeToken, authorizePermissions('admin', 'owner')], updateHotel)
    .delete([decodeToken, authorizePermissions('admin', 'owner')], deleteHotel)





module.exports = router;

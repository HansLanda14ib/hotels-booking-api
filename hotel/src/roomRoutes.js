const express = require('express');
const router = express.Router();
const { authorizePermissions, decodeToken} = require('./middleware/authentication')

const {
    createRoom, getAllRooms, updateRoom, deleteRoom, getSingleRoom
} = require('./roomController');

router
    .route('/')
    .post([decodeToken, authorizePermissions('admin', 'owner')], createRoom)
    .get(getAllRooms)

router.route('/hotel/:id').get(getAllRooms)
router
    .route('/:id')
    .get(getSingleRoom)
    .patch([decodeToken, authorizePermissions('admin', 'owner')], updateRoom)
    .delete([decodeToken, authorizePermissions('admin', 'owner')], deleteRoom)


module.exports = router;

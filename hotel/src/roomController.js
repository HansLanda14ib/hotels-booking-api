const Room = require('./RoomModel')

const createRoom = async (req, res) => {
    res.send('create room')
}
const updateRoom = async (req, res) => {
    res.send('update room')
}
const deleteRoom = async (req, res) => {
    res.send('delete room')
}
const getAllRooms = async (req, res) => {
    res.send('all rooms')
}

const getSingleRoom = async (req, res) => {
    res.send('get single room')
}

module.exports = {
    getAllRooms, deleteRoom, createRoom, getSingleRoom, updateRoom
}

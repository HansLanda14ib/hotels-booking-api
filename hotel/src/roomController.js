const Room = require('./RoomModel')
const Hotel = require('./hotelModel')
const CustomError = require('./errors')
const {StatusCodes} = require("http-status-codes");
const {checkPermissions} = require("./utils");
const createRoom = async (req, res) => {
    const userId = req.user.userId
    const hotel = await Hotel.findOne({user: userId})
    console.log(hotel)
    if (!hotel) throw new CustomError.NotFoundError('hotel not found, must add your hotel first')
    const room = await Room.create({...req.body, hotel: hotel._id})
    res.status(StatusCodes.CREATED).json({success: true, message: 'Room created successfully', room});
}
const updateRoom = async (req, res) => {
    const {id: roomId} = req.params
    const room = await Room.findOne({_id: roomId})
    if (!room) throw new CustomError.NotFoundError('room not found')
    const hotelId = room.hotel
    const hotel = await Hotel.findOne({_id: hotelId})
    const userId = hotel.user
    checkPermissions(req.user, userId)
    const updatedRoom = await Room.findOneAndUpdate({_id: roomId}, req.body, {runValidators: true, new: true})
    res.status(StatusCodes.OK).json({success: true, message: 'Room updated successfully', room: updatedRoom})
}
const deleteRoom = async (req, res) => {
    const room = await Room.findOne({_id: req.params.id})
    if (!room) throw new CustomError.NotFoundError('room not found')
    await room.remove()
    res.status(StatusCodes.OK).json({success: true, message: 'Hotel deleted successfully'})
}
const getAllRooms = async (req, res) => { // for specific hotel
    const rooms = await Room.find({hotel: req.params.id})
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'get all rooms successfully',
        count: rooms.length,
        rooms
    })
}

const getSingleRoom = async (req, res) => {
    const room = await Room.findOne({_id: req.params.id})
    if (!room) throw new CustomError.NotFoundError('room not found with this id: ' + req.params.id)
    res.status(StatusCodes.OK).json({success: true, message: 'get room successfully', room})
}

module.exports = {
    getAllRooms, deleteRoom, createRoom, getSingleRoom, updateRoom
}

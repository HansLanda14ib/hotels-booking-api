const Room = require('./RoomModel')
const Hotel = require('./hotelModel')
const CustomError = require('./errors')
const {StatusCodes} = require("http-status-codes");
const {checkPermissions} = require("./utils");
const axios = require('axios')
const {createJWT} = require('./utils/jwt')
const amqp = require("amqplib");
const queue = 'email-task';

// rabbitmq
let channel, connection;

async function connect() {

    connection = await amqp.connect(process.env.AMQP_SERVER);
    channel = await connection.createChannel();
    await channel.assertQueue(queue);
    console.log("Hotel Service : RabbitMQ connected");
}

connect();
// Publisher


let apiUrl;
if (process.env.NODE_ENV === 'production') {
    apiUrl = process.env.BOOKING_PROD_URL;
} else {
    apiUrl = process.env.BOOKING_DEV_URL;
}

const createRoom = async (req, res) => {
    const userId = req.user.userId
    const hotel = await Hotel.findOne({user: userId})

    console.log(hotel)
    if (!hotel) throw new CustomError.NotFoundError('hotel not found, must add your hotel first')
    const room = await Room.create({...req.body, hotel: hotel._id, ownerEarnedPrice: req.body.basePrice * 0.95})
    hotel.rooms.push(room._id)
    await hotel.save()
    res.status(StatusCodes.CREATED).json(room);
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
    res.status(StatusCodes.OK).json(updatedRoom)
}
const deleteRoom = async (req, res) => {
    const room = await Room.findOne({_id: req.params.id})
    if (!room) throw new CustomError.NotFoundError('room not found')
    await room.remove()
    res.status(StatusCodes.OK).json({message: 'Hotel deleted successfully'})
}
const getAllRooms = async (req, res) => { // for specific hotel
    const rooms = await Room.find({hotel: req.params.id})
    res.status(StatusCodes.OK).json(rooms)
}

const getSingleRoom = async (req, res) => {
    const room = await Room.findOne({_id: req.params.id})
    if (!room) throw new CustomError.NotFoundError('room not found with this id: ' + req.params.id)
    res.status(StatusCodes.OK).json(room)
}

const bookRoom = async (req, res) => {
    const roomId = req.params.id
    const room = await Room.findOne({_id: roomId})
    const hotel = await Hotel.findOne({_id: room.hotel})

    if (!room) throw new CustomError.NotFoundError('room not found with this id: ' + req.params.id)
    if (req.body.guests > room.maxPeople)
        throw new CustomError.BadRequestError('number of guests exceeds the maximum number of people allowed')
    //console.log(req.user.userId)
    const payload = {
        roomId: room._id,
        hotelId: room.hotel,
        maxPeople: room.maxPeople,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        guests: req.body.guests,
        user: req.user.userId,
        basePrice: room.basePrice,
        ownerEarnedPrice: room.ownerEarnedPrice
    }

    try {
        const token = createJWT({payload: req.user.userId})
        //console.log(token)
        const config = {
            headers: {
                'x-access-token': token
            }
        };
        //console.log(payload)
        console.log(apiUrl)
        const response = await axios.post(`${apiUrl}/create`, payload, config)
        //send to queue
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(({
            mail: req.user.email,
            hotel: hotel,
            room: room,
            booking: response.data
        }))));
        //const {bookingCreated, clientSecret} = response.data
        res.status(StatusCodes.CREATED).json(response.data)
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.response.data});
    }

}


module.exports = {
    getAllRooms, deleteRoom, createRoom, getSingleRoom, updateRoom, bookRoom
}

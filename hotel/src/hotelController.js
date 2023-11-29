const Hotel = require('./hotelModel')
const {StatusCodes} = require("http-status-codes");
const CustomError = require('./errors')
const {checkPermissions} = require('./utils')
const axios = require('axios')
const createHotel = async (req, res) => {
    const userId = req.user.userId
    const {name, location, title, desc, photos} = req.body
    const newHotel = await Hotel.create({
        name, location, title, desc, photos, user: userId,
    });
    res.status(StatusCodes.CREATED).json(newHotel);
}
const updateHotel = async (req, res) => {
    const {id: hotelId} = req.params
    const hotel = await Hotel.findOne({_id: hotelId})
    if (!hotel) throw new CustomError.NotFoundError('hotel not found')
    checkPermissions(req.user, hotel.user)
    const updatedHotel = await Hotel.findOneAndUpdate({_id: hotelId}, req.body, {runValidators: true, new: true})
    res.status(updatedHotel)
}
const deleteHotel = async (req, res) => {
    const hotel = await Hotel.findOne({_id: req.params.id})
    if (!hotel) throw new CustomError.NotFoundError('hotel not found')
    await hotel.remove()
    res.status(StatusCodes.OK).json({message: 'Hotel deleted successfully'})
}
const getAllHotels = async (req, res) => {
    const hotels = await Hotel.find({}).populate('rooms')
    res.status(StatusCodes.OK).json(hotels)
}
const getSingleHotel = async (req, res) => {
    const hotel = await Hotel.findOne({_id: req.params.id})
    if (!hotel) throw new CustomError.NotFoundError('hotel not found')
    res.status(StatusCodes.OK).json(hotel)
}

const availableHotels = async (req, res) => {
    try {
        const {checkInDate, checkOutDate, guests, city} = req.body
        const response = await axios.get(`http://localhost:5002/api/v1/bookings/bookedHotels?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`)
        const roomsIds = response.data
        console.log(roomsIds)
        let hotels = await Hotel.find({'location.city': city}).populate({ //  {maxPeople: {$gte: guests}}
            path: 'rooms',
            match: {
                maxPeople: {$gte: guests}, _id: {$nin: roomsIds}
            }
        })
        hotels = hotels.filter(hotel => hotel.rooms.length > 0)
        console.log(hotels)
        res.status(StatusCodes.OK).json(hotels)
    } catch
        (error) {
        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).json({message: error.message})
    }


}

module.exports = {
    getAllHotels, deleteHotel, createHotel, getSingleHotel, updateHotel, availableHotels
}

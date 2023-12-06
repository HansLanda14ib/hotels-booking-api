const Hotel = require('./hotelModel')
const {StatusCodes} = require("http-status-codes");
const CustomError = require('./errors')
const {checkPermissions} = require('./utils')
const axios = require('axios')

let apiUrl;

if (process.env.NODE_ENV === 'production') {
    apiUrl = process.env.BOOKING_PROD_URL || 'https://booking-api-j0fx.onrender.com/api/v1/bookings'
} else {
    apiUrl = process.env.BOOKING_DEV_URL || 'http://localhost:5002/api/v1/bookings';
}

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
        const {checkInDate, checkOutDate, guests, city} = req.query
        console.log("params")
        console.log(checkInDate, checkOutDate, guests, city)
        if (!checkInDate || !checkOutDate || !guests || !city)
            throw new CustomError.BadRequestError('Missing required query parameters')
        if (new Date(checkInDate) > new Date(checkOutDate))
            throw new CustomError.BadRequestError('Check in date must be before check out date')
        if (new Date(checkInDate) < new Date())
            throw new CustomError.BadRequestError('Check in date must be in the future')
        if (guests < 1)
            throw new CustomError.BadRequestError('Guests must be at least 1')
        // Check if checkInDate is within the next year
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        if (new Date(checkInDate) > maxDate)
            throw new CustomError.BadRequestError('Check in date must be within one year from now')
        // check duration more than one night
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const duration = Math.round(Math.abs((new Date(checkInDate) - new Date(checkOutDate)) / oneDay));
        if (duration < 1)
            throw new CustomError.BadRequestError('Duration must be at least one night')
        console.log(`${apiUrl}/bookedHotels?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`)
        const response = await axios.get(`${apiUrl}/bookedHotels?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`)
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

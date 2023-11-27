const Hotel = require('./hotelModel')
const {StatusCodes} = require("http-status-codes");
const CustomError = require('./errors')
const {checkPermissions} = require('./utils')
const createHotel = async (req, res) => {
    const userId = req.user.userId
    const {name, location, title, desc, photos} = req.body
    const newHotel = await Hotel.create({
        name,
        location,
        title,
        desc,
        photos,
        user: userId,
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
    res.status(StatusCodes.OK).json(
        hotels
    )
}
const getSingleHotel = async (req, res) => {
    const hotel = await Hotel.findOne({_id: req.params.id})
    if (!hotel) throw new CustomError.NotFoundError('hotel not found')
    res.status(StatusCodes.OK).json(hotel)
}

module.exports = {
    getAllHotels, deleteHotel, createHotel, getSingleHotel, updateHotel
}

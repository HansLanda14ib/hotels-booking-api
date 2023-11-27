const Hotel = require('./hotelModel')
const {StatusCodes} = require("http-status-codes");
const CustomError = require('./errors')
const {checkPermissions} = require('./utils')
const createHotel = async (req, res) => {
    // check if verified user
    // then create hotel
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
    res.status(StatusCodes.CREATED).json({success: true, message: 'Hotel created successfully', hotel: newHotel});
}
const updateHotel = async (req, res) => {
    const {id: hotelId} = req.params
    const hotel = await Hotel.findOne({_id: hotelId})
    if (!hotel) throw new CustomError.NotFoundError('hotel not found')
    checkPermissions(req.user, hotel.user)
    const updatedHotel = await Hotel.findOneAndUpdate({_id: hotelId}, req.body, {runValidators: true, new: true})
    res.status(StatusCodes.OK).json({success: true, message: 'Hotel updated successfully', hotel: updatedHotel})
}
const deleteHotel = async (req, res) => {
    const hotel = await Hotel.findOne({_id: req.params.id})
    if (!hotel) throw new CustomError.NotFoundError('hotel not found')
    await hotel.remove()
    res.status(StatusCodes.OK).json({success: true, message: 'Hotel deleted successfully'})
}
const getAllHotels = async (req, res) => {
    const hotels = await Hotel.find({}).populate('rooms')
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'get all hotels successfully',
        count: hotels.length,
        hotels
    })
}

const getSingleHotel = async (req, res) => {
    const hotel = await Hotel.findOne({_id: req.params.id})
    if (!hotel) throw new CustomError.NotFoundError('hotel not found')
    res.status(StatusCodes.OK).json({success: true, message: 'get hotel successfully', hotel})
}



module.exports = {
    getAllHotels, deleteHotel, createHotel, getSingleHotel, updateHotel
}

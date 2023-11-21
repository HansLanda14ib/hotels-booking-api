const Booking = require('./bookingModel');
const {StatusCodes} = require("http-status-codes");
const CustomError = require('./errors')
const {checkPermissions} = require('./utils')
const {connectMQ} = require("./app");

const getAllBooking = async (req, res) => {
    const bookings = await Booking.find({});
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Get all bookings successfully',
        count: bookings.length,
        bookings
    })
}
const getSingleBooking = async (req, res) => {
    const {id: bookingId} = req.params
    const booking = await Booking.findOne({_id: bookingId})
    if (!booking) throw  new CustomError.NotFoundError('no booking with this id')
    res.status(StatusCodes.OK).json(booking)

}


const createBooking = async (req, res) => {

            let channel;
            channel.consume(
                "BOOK",
                (data) => {
                    console.log("Consuming data from BOOK queue")
                    const {room,payload} = JSON.parse(data.content.toString())
                    //console.log(room)
                    const booking = new Booking({
                        room: room._id,
                        user: 'tempCostumerId',
                        checkIn: payload.checkIn,
                        checkOut: payload.checkOut,
                        guests: payload.guests,
                        basePrice: room.basePrice,
                        ownerEarnedPrice: room.ownerEarnedPrice
                    })
                    booking.save()
                    channel.ack(data)
                    channel.sendToQueue(
                        "ROOM",
                        Buffer.from(JSON.stringify({booking}))
                    );

                }


    )

    res.send("create booking")

}
const updateBooking = async (req, res) => {
    const {id: bookingId} = req.params
    const {paymentStatus, guests} = req.body
    const booking = await Booking.findOne({_id: bookingId})
    if (!booking) throw  new CustomError.NotFoundError('no booking with this id')
    booking.paymentStatus = paymentStatus
    booking.guests = guests
    await booking.save()
    res.status(StatusCodes.OK)

}
const deleteBooking = async (req, res) => {

}
const getCustomerBookings = async (req, res) => {
    /*
    basePrice: 100,
    taxes: 14,
    authorEarnedPrice: 97,
     */
}
const getHotelBookings = async (req, res) => {

}


module.exports = {
    getAllBooking,
    getSingleBooking,
    createBooking,
    updateBooking,
    deleteBooking,
    getCustomerBookings,
    getHotelBookings

};
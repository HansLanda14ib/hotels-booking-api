const Booking = require('./bookingModel');
const {StatusCodes} = require("http-status-codes");
const CustomError = require('./errors')
const {checkPermissions} = require('./utils')
const mongoose = require("mongoose");

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
    const {id: bookingId} = req.params
    const booking = await Booking.findOne({_id: bookingId})
    if (!booking) throw new CustomError.NotFoundError('no booking with this id')
    await booking.remove()
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Delete booking successfully',
    })

}
const getCustomerBookings = async (req, res) => {
    const bookings = await Booking.find({user: req.user.userId})
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Get all bookings successfully',
        count: bookings.length,
        bookings
    })
}
const getHotelBookings = async (req, res) => {


}
/*
const createBooking = async (room, payload) => {
    let bookingData;
    Booking.aggregate([
        {
            $match: {
                room: mongoose.Types.ObjectId(room._id),
                $or: [
                    {
                        checkInDate: {$lt: new Date(payload.checkOutDate)},
                        checkOutDate: {$gt: new Date(payload.checkInDate)}
                    },
                    {
                        checkOutDate: {$gt: new Date(payload.checkInDate)},
                        checkInDate: {$lt: new Date(payload.checkOutDate)}
                    }
                ]
            }
        }

    ]).exec(async (err, bookings) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(bookings.length);
        if (!bookings.length > 0) {
            console.log('Good to go, No bookings found for the specified room');
            const booking = new Booking({
                room: room._id,
                user: payload.user,
                checkInDate: payload.checkInDate,
                checkOutDate: payload.checkOutDate,
                guests: payload.guests,
                basePrice: room.basePrice,
                ownerEarnedPrice: room.ownerEarnedPrice
            });
            try {
                bookingData = await booking.save();
                //console.log('Booking saved:', bookingData); OK
            } catch (error) {
                console.error('Error saving booking:', error);
            }
        } else
            console.log('Sorry, Room is already booked for the specified dates');
        //console.log("from bookingController"+bookingData._id) OK
        return bookingData

    });
}

 */
/*
const createBooking2 = async (room, payload) => {
    return new Promise((resolve, reject) => {
        Booking.aggregate([
            {
                $match: {
                    room: mongoose.Types.ObjectId(room._id),
                    $or: [
                        {
                            checkInDate: {$lt: new Date(payload.checkOutDate)},
                            checkOutDate: {$gt: new Date(payload.checkInDate)}
                        },
                        {
                            checkOutDate: {$gt: new Date(payload.checkInDate)},
                            checkInDate: {$lt: new Date(payload.checkOutDate)}
                        }
                    ]
                }
            }
        ]).exec(async (err, bookings) => {
            if (err) {
                console.error(err);
                reject({ success: false, message: 'Error occurred during booking check.' });
                return;
            }

            if (!bookings.length > 0) {
                console.log('Good to go, No bookings found for the specified room');
                const booking = new Booking
                ({
                    room: room._id,
                    user: payload.user,
                    checkInDate: payload.checkInDate,
                    checkOutDate: payload.checkOutDate,
                    guests: payload.guests,
                    basePrice: room.basePrice,
                    ownerEarnedPrice: room.ownerEarnedPrice
                });
                try {
                    const bookingData = await booking.save();
                    resolve({ success: true, message: 'Booking successful.', bookingData });
                } catch (error) {
                    console.error('Error saving booking:', error);
                    reject({ success: false, message: 'Error saving the booking.'});
                }
            } else {
                console.log('Sorry, Room is already booked for the specified dates');
                resolve({ success: false, message: 'Room is already booked for the specified dates.', bookingData: null });
            }
        });
    });
};
*/
const createBooking = async (req, res) => {
    const {roomId, maxPeople,basePrice, ownerEarnedPrice, checkInDate, checkOutDate, guests, user} = req.body
    const checkInFilter = [
        {
            checkInDate: {$lt: new Date(checkOutDate)},
            checkOutDate: {$gt: new Date(checkInDate)}
        },
        {
            checkOutDate: {$gt: new Date(checkInDate)},
            checkInDate: {$lt: new Date(checkOutDate)}
        }
    ]
    let docs = await Booking.aggregate([
        {
            $match: {
                room: mongoose.Types.ObjectId(roomId),
                $or: checkInFilter
            }
        }

    ])
    console.log("length: " + docs.length)
    if (docs.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).send('Room is already booked for the specified dates.');

    }
    console.log('No conflicting bookings found for the room.');
    const booking = new Booking
    ({
        room: roomId,
        user: user,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        guests: guests,
        basePrice: basePrice,
        ownerEarnedPrice: ownerEarnedPrice
    });
    const bookingData = await booking.save();
    const bookingCreated = {
        room: bookingData.room,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guests: bookingData.guests,
        basePrice: bookingData.basePrice,
        ownerEarnedPrice: bookingData.ownerEarnedPrice,
        paymentStatus: bookingData.paymentStatus,
        taxes: bookingData.taxes,
        totalPrice: bookingData.totalPrice,
    }
    return res.json(bookingCreated)


}
module.exports = {
    getAllBooking,
    getSingleBooking,
    updateBooking,
    deleteBooking,
    getCustomerBookings,
    getHotelBookings,
    createBooking

};
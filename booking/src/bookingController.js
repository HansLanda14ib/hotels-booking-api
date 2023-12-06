const Booking = require('./bookingModel');
const {StatusCodes} = require("http-status-codes");
const CustomError = require('./errors')
const mongoose = require("mongoose");
const stripe = require('stripe')(process.env.STRIPE_KEY);
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
    if (!booking) throw new CustomError.NotFoundError('no booking with this id')
    res.status(StatusCodes.OK).json(booking)

}

const updateBooking = async (req, res) => {
    const {id: bookingId} = req.params
    const {paymentIntentId} = req.body;
    const booking = await Booking.findOne({_id: bookingId})
    if (!booking) throw new CustomError.NotFoundError('no booking with this id')

    // don't forget to check if the user is the owner of the booking

    booking.paymentIntentId = paymentIntentId
    booking.paymentStatus = 'Paid'
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
    const {roomId, hotelId, basePrice, ownerEarnedPrice, checkInDate, checkOutDate, guests, user} = req.body
    console.log(req.body)
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
        hotel: hotelId,
        user: user,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        guests: guests,
        basePrice: basePrice,
        ownerEarnedPrice: ownerEarnedPrice
    });
    //console.log("booking: " + booking)

    const bookingData = await booking.save();

    // calculate number of staying nights
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const numberOfNights = (checkOut - checkIn) / (1000 * 3600 * 24)

    // calculate total amount
    const totalAmount = bookingData.totalPrice * numberOfNights
    console.log("checkIn: " + checkIn)
    console.log("checkOut: " + checkOut)
    console.log("numberOfNights: " + numberOfNights)
    console.log("totalAmount: " + totalAmount)


    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100,
        currency: 'usd',
    });
    console.log("paymentIntent.client_secret: " + paymentIntent.client_secret)

    const bookingCreated = {
        _id: bookingData._id,
        room: bookingData.room,
        hotel: bookingData.hotel,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guests: bookingData.guests,
        basePrice: bookingData.basePrice,
        ownerEarnedPrice: bookingData.ownerEarnedPrice,
        paymentStatus: bookingData.paymentStatus,
        taxes: bookingData.taxes,
        totalPrice: bookingData.totalPrice,
    }
    return res.json({bookingCreated, clientSecret: paymentIntent.client_secret})


}
const bookedHotels = async (req, res) => {
    const {checkInDate, checkOutDate} = req.query
    //console.log(checkInDate, checkOutDate)
    const filter = [
        {
            checkInDate: {$lt: new Date(checkOutDate)},
            checkOutDate: {$gt: new Date(checkInDate)}
        },
        {
            checkOutDate: {$gt: new Date(checkInDate)},
            checkInDate: {$lt: new Date(checkOutDate)}
        }
    ]
    const docs = await Booking.aggregate([{$match: {$or: filter}}])
    //console.log("docs   :"+docs)
    //extract the hotel ids
    const roomsIds = docs.map(booking => booking.room)
    //console.log(hotelIds)
    return res.json(roomsIds)
}
module.exports = {
    getAllBooking,
    getSingleBooking,
    updateBooking,
    deleteBooking,
    getCustomerBookings,
    getHotelBookings,
    createBooking, bookedHotels

};
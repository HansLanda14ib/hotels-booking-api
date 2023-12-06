require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const port = process.env.PORT || 5002;
const uri = process.env.MONGO_BOOKING_SERVICE || 'mongodb+srv://hanslanda:halamadrid11@cluster0.zep2i0j.mongodb.net/booking-service?retryWrites=true&w=majority';
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


//db
const connectDB = require('./db/connect');

// routes
const bookingRouter = require('./bookingRoutes');

// morgan and cookie-parser
const morgan = require('morgan')
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
//const amqp = require("amqplib");
//const Booking = require("./bookingModel");
//const mongoose = require("mongoose");


app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan('tiny'))
app.use(express.json());
app.use(express.static('./public'));


// rabbitmq
/*
const setupBookingConsumer = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        await channel.assertQueue("BOOKING", {durable: true});
        console.log("Booking Service: RabbitMQ connected");

        await channel.consume("BOOKING", async (data) => {
            const {room, payload} = JSON.parse(data.content.toString());

            try {
                const bookings = await Booking.aggregate([
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
                ]).exec();

                if (bookings.length === 0) {
                    // Create booking if room is available
                    const booking = new Booking({
                        room: room._id,
                        user: payload.user,
                        checkInDate: payload.checkInDate,
                        checkOutDate: payload.checkOutDate,
                        guests: payload.guests,
                        basePrice: room.basePrice,
                        ownerEarnedPrice: room.ownerEarnedPrice
                    });

                    const bookingData = await booking.save();
                    await channel.sendToQueue("ROOMS", Buffer.from(JSON.stringify({
                            success: true,
                            msg: 'Booking successful.',
                            booking:bookingData
                    })));
                } else {
                    // Room is already booked for the specified dates
                    await channel.sendToQueue("ROOMS", Buffer.from(JSON.stringify({
                        success: false,
                        msg: 'Room is already booked for the specified dates.',
                        booking: null
                    })));
                }
                await channel.ack(data);
            } catch (error) {
                console.error("Error processing message:", error);
                await channel.reject(data, false);
            }
        });
    } catch (err) {
        console.error("Failed to connect to RabbitMQ:", err.message);
    }
};
*/
// other routes
app.use('/api/v1/bookings', bookingRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const start = async () => {
    try {
        await connectDB(uri);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
       // await setupBookingConsumer();
    } catch (error) {
        console.log(error);
    }
};

start();

module.exports = {app};

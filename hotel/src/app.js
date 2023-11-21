require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const {StatusCodes} = require("http-status-codes");
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const {decodeToken} = require('./middleware/authentication')
//db
const connectDB = require('./db/connect');

// rabbitmq
const amqp = require("amqplib");
var channel, connection;
const connectMQ = async () => {
    try {
        const amqpServer = "amqp://localhost:5672";
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("ROOM");

        // Handle message consumption after queue assertion
        channel.consume("ROOM", (data) => {
            const book = JSON.parse(data.content);
            //console.log("Received booking data:", book);
            channel.ack(data);
        });

        console.log("MQ connected and ROOM queue created");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
};



// routes

const hotelRouter = require('./hotelRoutes');
const roomRouter = require('./roomRoutes');

// morgan and cookie-parser
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
//const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const Room = require("./RoomModel");
const CustomError = require("./errors");

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());


app.use(morgan('tiny'))
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload({useTempFiles: true}));

app.post('/api/v1/rooms/book/:id', decodeToken, async (req, res) => {
    let book;
    const room = await Room.findOne({_id: req.params.id})
    const payload = req.body
    payload.user = req.user.userId
    if (!room) throw new CustomError.NotFoundError('room not found with this id: ' + req.params.id)
    channel.sendToQueue(
        "BOOK",
        Buffer.from(JSON.stringify({room, payload}))
    );
    res.status(StatusCodes.ACCEPTED).json({ message: "Booking request accepted" });

});

app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/rooms', roomRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5001;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_HOTEL_SERVICE);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
        await connectMQ();
    } catch (error) {
        console.log(error);
    }
};

start();

module.exports = app;

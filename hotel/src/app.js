require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//db
const connectDB = require('./db/connect');
 const uri = process.env.MONGO_HOTEL_SERVICE || 'mongodb+srv://hanslanda:halamadrid11@cluster0.zep2i0j.mongodb.net/hotel-service?retryWrites=true&w=majority';

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
// const amqp = require("amqplib");
//const Room = require("./RoomModel");
//const CustomError = require("./errors");
// const {StatusCodes} = require("http-status-codes");




// rabbitmq
let channel, connection;
/*
async function connect() {

    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    await channel.assertQueue("ROOMS");
    console.log("Hotel Service : RabbitMQ connected");
}

connect();
*/

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan('tiny'))
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload({useTempFiles: true}));


app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/rooms', roomRouter);

/*
app.post('/room/book/:id', async (req, res) => {

    try {
        const room = await Room.findOne({_id: req.params.id});
        //if (!room) throw new CustomError.NotFoundError('Room not found with this id: ' + req.params.id);
        const payload = req.body;
        payload.user = "req.user.userId";

        await channel.sendToQueue("BOOKING", Buffer.from(JSON.stringify({room, payload})));

        const consumePromise = new Promise((resolve, reject) => {
            channel.consume('ROOMS', (message) => {
                const content = message.content.toString();
                const parsedContent = JSON.parse(content);
                channel.ack(message);
                console.log("result inside consume:", parsedContent.success, parsedContent.msg, parsedContent.booking);
                resolve(parsedContent);
            });
        });

        const parsedContent = await consumePromise;
        return res.status(StatusCodes.OK).json(parsedContent);
    } catch (err) {
        console.error(err.message);
        res.status(StatusCodes.BAD_REQUEST).json({success: false, message: "Failed to book room"});
    }
})
*/


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5001;


const start = async () => {
    try {
        await connectDB(uri);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));

    } catch (error) {
        console.log(error);
    }
};

start();

module.exports = app;

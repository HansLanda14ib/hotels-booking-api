require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//db
const connectDB = require('./db/connect');
 const uri = process.env.MONGO_HOTEL_SERVICE
// routes
const hotelRouter = require('./hotelRoutes');
const roomRouter = require('./roomRoutes');

// morgan and cookie-parser
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');






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



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5001;


const start = async () => {
    try {
        await connectDB(uri);
        app.listen(port, () => console.log(`Server Hotel-service is listening on port ${port}...`));

    } catch (error) {
        console.log(error);
    }
};

start();

module.exports = app;

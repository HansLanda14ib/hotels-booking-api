require('dotenv').config({ path: '../.env' });
require('express-async-errors');
const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//db
const connectDB = require('./connect');

// routes
const userRouter = require('./userRoutes')

app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('<h1>User Service</h1> <a href="">Documentation</a>');
});

app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies)
    res.send('User Service');
});


app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = 5002;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_USER_SERVICE);
        app.listen(port, () => console.log(`User Service - port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();

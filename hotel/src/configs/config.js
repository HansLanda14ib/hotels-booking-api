require("dotenv").config();


module.exports = {
    port: process.env.PORT,
    mongoURI: process.env.MONGO_HOTEL_SERVICE,
    JWT_SECRET: process.env.JWT_SECRET,
};
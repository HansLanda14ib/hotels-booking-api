const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const hotelRouter = require("./hotelRoutes");
require('dotenv').config({path: '../.env'});

class App {
    constructor() {
        this.app = express();
        this.connectDB();
        this.setMiddlewares();
        this.setRoutes();
    }

    async connectDB() {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    }

    async disconnectDB() {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    }

    setMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    setRoutes() {
        this.app.use("/api/v1/hotels", hotelRouter);
    }


    start() {
        this.server = this.app.listen(config.port, () =>
            console.log(`Server started on port ${config.port}`)
        );
    }

    async stop() {
        await mongoose.disconnect();
        this.server.close();
        console.log("Server stopped");
    }
}

module.exports = App;
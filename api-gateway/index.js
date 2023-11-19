const express = require("express");
const httpProxy = require("http-proxy");
require('dotenv').config();
const proxy = httpProxy.createProxyServer();
const app = express();
const service_hotel_port = process.env.SERVICE_HOTEL_PORT || 5001;
const service_booking_port = process.env.SERVICE_BOOKING_PORT  || 5002;
const api_gateway_port =process.env.API_GATEWAY_PORT || 5555;
// Route requests to the front-end service

// Route requests to the product service
app.use("/hotel", (req, res) => {
    proxy.web(req, res, {target: `http://localhost:${service_hotel_port}/api/v1`});
});

app.use("/booking", (req, res) => {
    proxy.web(req, res, {target: `http://localhost:${service_booking_port}/api/v1`});
});


// Start the API Gateway on port 5555
app.listen(api_gateway_port, () => {
    console.log(`API Gateway listening on port ${api_gateway_port}`);
});
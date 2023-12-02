const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const app = express();
const service_hotel_port = process.env.SERVICE_HOTEL_PORT || 5001;
const service_booking_port = process.env.SERVICE_BOOKING_PORT  || 5002;
const api_gateway_port =process.env.API_GATEWAY_PORT || 5555;
// Route requests to the front-end service
let hotelApi,BookingsApi;
if (process.env.NODE_ENV === 'production') {
    hotelApi = process.env.HOTEL_PROD_URL;
    BookingsApi = process.env.BOOKING_PROD_URL;
}
else {
    hotelApi = process.env.HOTEL_DEV_URL;
    BookingsApi = process.env.BOOKING_DEV_URL;

}
// Route requests to the product service
app.use("/api/v1/hotels", createProxyMiddleware({
    target: hotelApi,
    changeOrigin: true
}));
// Route requests to the booking service
app.use("/api/v1/bookings", createProxyMiddleware({
    target: BookingsApi,
    changeOrigin: true
}));


// Start the API Gateway on port 5555
app.listen(api_gateway_port, () => {
    console.log(`API Gateway listening on port ${api_gateway_port}`);
});
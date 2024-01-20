const express = require("express");
const {createProxyMiddleware} = require('http-proxy-middleware');
require('dotenv').config();
const app = express();
const api_gateway_port = process.env.API_GATEWAY_PORT || 5555;
// Route requests to the front-end service
let hotelApi, BookingsApi;
if (process.env.NODE_ENV === 'production') {
    hotelApi = process.env.HOTEL_PROD_URL;
    BookingsApi = process.env.BOOKING_PROD_URL;
} else {
    hotelApi = process.env.HOTEL_DEV_URL;
    BookingsApi = process.env.BOOKING_DEV_URL;

}
// swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

// custom swagger
const options = {
    customSiteTitle: "TravelEase Api-docs",
    customCss: '.swagger-ui .topbar { display: none }',
    customFavicon: './assets/favicon.ico'
};

app.use('/api-docs/favicon.ico', express.static('./assets/favicon.ico'));
// Route api-docs to swagger
app.get('/', (req, res) => {
    res.send('<h1>Booking Hotels API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Route requests to the product service
app.use("/api/v1/hotels", createProxyMiddleware({
    target: hotelApi,
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/hotels': '', // Remove the /api/v1/hotels prefix from the URL
    },
}));
// Route requests to the booking service
app.use("/api/v1/bookings", createProxyMiddleware({
    target: BookingsApi,
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/bookings': '', // Remove the /api/v1/bookings prefix from the URL
    },
}));


// Start the API Gateway on port 5555
app.listen(api_gateway_port, () => {
    console.log(`API Gateway isss listening on port ${api_gateway_port}`);
});
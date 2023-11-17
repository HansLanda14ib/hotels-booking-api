const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();

// Route requests to the auth service

// Route requests to the product service
app.use("/hotel", (req, res) => {
    proxy.web(req, res, {target: "http://localhost:5001"});
});

app.use("/booking", (req, res) => {
    proxy.web(req, res, {target: "http://localhost:5002"});
});
app.use("/user", (req, res) => {
    proxy.web(req, res, {target: "http://localhost:5003"});
});

// Start the server
const port = 5003;
app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});
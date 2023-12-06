const express = require('express');
const {json, urlencoded} = express;
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const {sendEmailEthereal} = require('./email.service');
const fs = require('fs'); // If reading from a file
const path = require('path'); // If reading from a file
const currentDir = path.resolve(__dirname); // If reading from a file
// Function to read the HTML template file
const readHTMLFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, {encoding: 'utf-8'}, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
};

const amqp = require('amqplib');
const queue = 'email-task';
const subject = 'Welcome to Hotels Booking';

let url_server;
if (process.env.NODE_ENV === 'production') {
    url_server = process.env.AMQP_CLOUD;
} else {
    url_server = process.env.AMQP_SERVER;

}
const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(url_server);
        console.log('Connected to RabbitMQ' + url_server)
        const channel = await connection.createChannel();

        await channel.assertQueue(queue);

        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const {mail, room, hotel, booking} = JSON.parse(msg.content.toString());
                    const address = hotel.location.addressLineOne + ' ' + hotel.location.addressLineTwo + ' ' + hotel.location.city + ' ' + hotel.location.state + ' ' + hotel.location.postCode;
                    const hotelPhoto = hotel.photos[0];
                    const hotelName = hotel.name;
                    const bookingDetails = booking.bookingCreated;
                    let checkInDate = new Date(bookingDetails.checkInDate);
                    let checkOutDate = new Date(bookingDetails.checkOutDate);
                    const num_nights = (checkOutDate - checkInDate) / (1000 * 3600 * 24);
                    checkInDate = checkInDate.toISOString().split('T')[0];
                    checkOutDate = checkOutDate.toISOString().split('T')[0];
                    //console.log(num_nights)
                    const totalOfStay = bookingDetails.totalPrice * num_nights;
                    console.log(totalOfStay)
                    console.log(' [x] Received %s', mail);

                    const filePath = currentDir + '/templates/booking_v2.html';
                    const htmlTemplate = await readHTMLFile(filePath);

                    const processedHTML = htmlTemplate
                        .replace('${booking_id}', bookingDetails._id)
                        .replace('${name}', mail)
                        .replace('${totalOfStay}', totalOfStay)
                        .replace('${checkInDate}', checkOutDate)
                        .replace('${hotel_name}', hotelName)
                        .replace('${hotel_address}', address)
                        .replace('${hotel_photo}', hotelPhoto)
                        .replace('${num_nights}', num_nights)
                        .replace('${checkIn}', checkInDate)
                        .replace('${checkOut}', checkOutDate)
                        .replace('${room_price}', bookingDetails.basePrice)
                        .replace('${taxes}', bookingDetails.taxes.toFixed(2)) //take 2 digits after the decimal point
                        .replace('${totalPrice}', bookingDetails.totalPrice)
                        .replace('${room_title}', room.title)
                        .replace('${room_number}', room.number)
                        .replace('${room_desc}', room.desc)
                        .replace('${room_photo}', room.photos[0])
                        .replace('${room_maxPeople}', room.maxPeople);

                    await sendEmailEthereal(mail, subject, processedHTML);
                    channel.ack(msg);
                } catch (err) {
                    console.error('Error processing message:', err);
                    channel.reject(msg, false); // Reject the message if an error occurs
                }
            }
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

connectToRabbitMQ();


/*
const open = require('amqplib').connect(process.env.AMQP_SERVER);
open.then(connection => connection.createChannel()).then(channel => channel.assertQueue(queue).then(() => {
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
    return channel.consume(queue, (msg) => {
        if (msg !== null) {
            const {mail, room, hotel, booking} = JSON.parse(msg.content.toString());
            const address = hotel.location.addressLineOne + ' ' + hotel.location.addressLineTwo + ' ' + hotel.location.city + ' ' + hotel.location.state + ' ' + hotel.location.postCode;
            const hotelPhoto = hotel.photos[0];
            const hotelName = hotel.name;
            const bookingDetails = booking.bookingCreated;
            let checkInDate = new Date(bookingDetails.checkInDate);
            let checkOutDate = new Date(bookingDetails.checkOutDate);
            // take just the date part
            checkInDate = checkInDate.toISOString().split('T')[0];
            checkOutDate = checkOutDate.toISOString().split('T')[0];
            const num_nights = (bookingDetails.checkOutDate - bookingDetails.checkInDate) / (1000 * 60 * 60 * 24);
            console.log(' [x] Received %s', mail);
            // send email via nodemailer
            const filePath = currentDir + '/templates/booking.html';
            readHTMLFile(filePath)
                .then((htmlTemplate) => {
                    const processedHTML = htmlTemplate
                        .replace('${booking_id}', bookingDetails._id)
                        .replace('${name}', mail)
                        .replace('${checkInDate}', checkOutDate)
                        .replace('${hotel_name}', hotelName)
                        .replace('${hotel_address}', address)
                        .replace('${hotel_photo}', hotelPhoto)
                        .replace('${num_nights}', num_nights)
                        .replace('${checkIn}', checkInDate)
                        .replace('${checkOut}', checkOutDate)
                        .replace('${room_price}', bookingDetails.basePrice)
                        .replace('${taxes}', bookingDetails.taxes.toFixed(2)) //take 2 digits after the decimal point
                        .replace('${totalPrice}', bookingDetails.totalPrice)
                        .replace('${room_title}', room.title)
                        .replace('${room_number}', room.number)
                        .replace('${room_desc}', room.desc)
                        .replace('${room_photo}', room.photos[0]);
                    sendEmailEthereal(mail, subject, processedHTML).then(() => {
                        channel.ack(msg);
                    });
                }).catch((err) => {
                console.error('Error reading HTML file:', err);
            });

        }
    });
})).catch(error => console.warn(error)); */


app.use(json());
app.use(urlencoded({extended: true}));

app.get('/', (req, res) => {
    return res.status(200).send({
        message: 'Welcome to our API'
    })
});

app.listen(5005, () => {
    console.log(`Notification app running on port: 5005`);
});

module.exports = app;
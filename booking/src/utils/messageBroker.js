const amqp = require("amqplib");
const {createBooking, createBooking2} = require("../bookingController");

class MessageBroker {
    static async connect() {
        try {
            const connection = await amqp.connect("amqp://localhost:5672");
            const channel = await connection.createChannel();

            // Declare the order queue
            await channel.assertQueue("BOOKING", {durable: true});
            console.log("Booking Service : RabbitMQ connected");

            // Consume messages from the bookings queue
            await channel.consume("BOOKING", async (data) => {
                try {
                    const {room, payload} = JSON.parse(data.content.toString());
                    const bookingResult  = await createBooking2(room, payload);
                    //console.log("from messageBroker : consumer"+booking) OK
                    await channel.sendToQueue("ROOMS",
                        Buffer.from(JSON.stringify({bookingResult }))
                    );
                    await channel.ack(data);
                } catch (error) {
                    console.error(error);
                    await channel.reject(data, false);
                }
            });

        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = MessageBroker;
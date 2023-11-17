const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        maxPeople: {
            type: Number,
            required: true,
        },
        bedrooms: {
            type: Number
        },
        beds: {
            type: Number
        },
        bathroomsNumber: {
            type: Number
        },
        desc: {
            type: String,
            required: true,
        },
        photos: {
            type: [String],
            default: ['/uploads/default_room.jpg'],
        },
        number: {
            type: Number,
            required: true,
        },
    },
    {timestamps: true}
);
module.exports = mongoose.model("Room", RoomSchema);
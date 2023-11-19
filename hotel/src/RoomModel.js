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
            type: Number,
            required: true,
        },
        beds: {
            type: Number, required: true,
        },
        bathrooms: {
            type: Number, required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        photos: {
            type: [String],
            default: ['/uploads/default_room.jpg'], required: true,
        },
        number: {
            type: Number,
            required: true,
        },
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true,
        }
    },
    {timestamps: true}
);
module.exports = mongoose.model("Room", RoomSchema);
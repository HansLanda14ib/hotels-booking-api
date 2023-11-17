import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            required: [true, 'Please provide hotel name'],
            maxlength: [50, 'Name can not be more than 50 characters'],
        },
        location: {
            country: {
                type: {}
            },
            addressLineOne: {
                type: String
            },
            addressLineTwo: {
                type: String
            },
            city: {
                type: {}
            },
            state: {
                type: {},
            },
            postCode: {
                type: String
            }
        },
        photos: {
            type: [String],
            default: ['/uploads/default_hotel.jpg'],
        },
        title: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: [true, 'Please provide hotel description'],
            maxlength: [1000, 'Description can not be more than 1000 characters'],
        },
        averageRating: {
            type: Number,
            min: 0,
            max: 5,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        rooms: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }],
        featured: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Types.ObjectId,
            //ref: 'User',
            required: true,
        },
    },
    {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

module.exports = mongoose.model("Hotel", HotelSchema)
const mongoose = require('mongoose');

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
        featured: {
            type: Boolean,
            default: false,
        },
        user: {
            type: String,
            required: true,
        },
    rooms:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Room'
        }
    ]
    },
    {timestamps: true,}
);
HotelSchema.index({hotel: 1, user: 1}, {unique: true});

HotelSchema.pre('remove', async function () {
    await this.model('Room').deleteMany({hotel: this._id})
})

module.exports = mongoose.model('Hotel', HotelSchema)
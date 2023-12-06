const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true},
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true},
    hotel: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true},
    checkInDate: {
        type: Date,
        required: true,
        validate: [
            {
                validator: function (value) {
                    // Check if checkInDate is after current date
                    return value > new Date();
                },
                message: 'Check-in date must be after current date',
            },
            {
                validator: function (value) {
                    // Check if checkInDate is before checkOutDate
                    return value < this.checkOutDate;
                },
                message: 'Check-in date must be before check-out date',
            },
            {
                validator: function (value) {
                    // Check if checkInDate is within the next year
                    const maxDate = new Date();
                    maxDate.setFullYear(maxDate.getFullYear() + 1);
                    return value < maxDate;
                },
                message: 'Check-in date must be within one year from now',
            },
        ],
    },
    checkOutDate: {
        type: Date,
        required: true,
        validate: [
            {
                validator: function (value) {
                    // Check if checkOutDate is after checkInDate
                    return value > this.checkInDate;
                },
                message: 'Check-out date must be after check-in date',
            },
            {
                validator: function (value) {
                    // Check if checkOutDate is within one year from now
                    const maxDate = new Date();
                    maxDate.setFullYear(maxDate.getFullYear() + 1);
                    return value < maxDate;
                },
                message: 'Check-out date must be within one year from now',
            },
        ],
    },
    guests: {
        type: Number, required: true,
        validate: []
    },
    basePrice: {type: Number, required: true},
    ownerEarnedPrice: {type: Number, required: true},
    taxes: {type: Number},
    totalPrice: {type: Number},
    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Paid', 'Cancelled'],
    },
    paymentIntentId: {
        type: String,
    },

}, {timestamps: true});

bookingSchema.pre('save', function (next) {
    this.taxes = this.basePrice * (14 / 100);
    this.totalPrice = this.basePrice + this.taxes;
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);

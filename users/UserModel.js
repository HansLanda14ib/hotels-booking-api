const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator')

const UserSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: [true, 'Please provide firstName'],
            maxlength: 50,
            minlength: 3,
        },
        lastName: {
            type: String,
            required: [true, 'Please provide lastName'],
            maxlength: 50,
            minlength: 3,
        },
        email: {
            type: String,
            required: [true, 'Please provide email'],
            validate: {
                validator: validator.isEmail,
                message: "Please provide valid email",

            },
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['admin', 'customer','owner'],
            default: 'customer',
        },
    },
    {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}
);


UserSchema.virtual('bookings', {
    //ref: 'Booking',
    localField: '_id',
    //foreignField: 'user',
    justOne: false,

})
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.comparePassword = async function (canditatePassword) {
    return await bcrypt.compare(canditatePassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});

module.exports = mongoose.model('User', userSchema);
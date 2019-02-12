const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],

    },
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required'],
    },
    status: {
        type: Boolean,
        default: true
    },
    role:{
        type: String,
        default: 'USER',
        enum: {
            values: ['ADMIN', 'USER'],
            message: 'Invalid user rol'
        }
    }
}).plugin(uniqueValidator, { err: 'Duplicated field'});

module.exports = mongoose.model('users', userSchema);
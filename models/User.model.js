const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    joined: {
        type: Date,
        default: Date.now
    },
    images: Array
})

module.exports = mongoose.model('UserInfo', UserSchema);

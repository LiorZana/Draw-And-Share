const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoginSchema = new Schema({
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
    hash: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('LoginInfo', LoginSchema);

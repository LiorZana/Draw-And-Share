const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PublicImageModel = new Schema({
    imageIndex: {
        type: Number,
        required: true
    },
    uploader: {
        type: String,
        required: true
    },
    svgCode: {
        type: String,
        required: true,
    },
    linesArray: {
        type: String,
        required: true,
    },
    pngBase64: {
        type: String,
        required: true,
    },
    uploaded: {
        type: Date,
        required: true,
        default: Date.now()
    }
})






module.exports = 
{ 
    PublicImageModel: mongoose.model('PublicImage', PublicImageModel)
};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageModel = new Schema({
    imageIndex: {
        type: Number,
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

const ImageUploadModel = new Schema({
    userId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    images: {
        type: Array.of(ImageModel),
    }
})




module.exports = 
{ 
    ImageModel: mongoose.model('Image', ImageModel),
    ImageUploadModel: mongoose.model('ImageUpload', ImageUploadModel)
};

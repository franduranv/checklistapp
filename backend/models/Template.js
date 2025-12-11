const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['boolean', 'text', 'photo'],
        default: 'boolean'
    },
    required: {
        type: Boolean,
        default: true
    }
});

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    items: [itemSchema]
});

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    areas: [areaSchema],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);

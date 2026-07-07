const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: ''
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: true,
        enum: ['fruits-vegetables', 'beverages', 'dairy', 'snacks']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



productSchema.index({ category: 1, createdAt: 1 });

module.exports = mongoose.model('Product', productSchema);

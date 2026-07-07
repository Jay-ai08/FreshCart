const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    items: [orderItemSchema],
    deliveryDetails: {
        firstName: String,
        lastName: String,
        phone: String,
        address: String,
        city: String,
        pincode: String,
        instructions: String
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'cod'],
        required: true
    },
    subtotal: Number,
    tax: Number,
    total: Number,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);

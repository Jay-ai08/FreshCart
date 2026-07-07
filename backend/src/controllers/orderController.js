const Order = require('../models/orderModel');
const crypto = require('crypto');
const { createId, isDatabaseReady, readStore, writeStore } = require('../utils/localStore');

function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function cleanOrderPayload(req, res) {
    const { items, deliveryDetails, paymentMethod } = req.body;
    const userId = req.user?.userId;
    const email = req.user?.email;

    if (!userId || !email) {
        res.status(401).json({ error: 'Please login before placing an order' });
        return null;
    }

    if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Cart is empty' });
        return null;
    }

    if (!deliveryDetails || !deliveryDetails.firstName || !deliveryDetails.phone || !deliveryDetails.address || !deliveryDetails.city || !deliveryDetails.pincode) {
        res.status(400).json({ error: 'Complete delivery details are required' });
        return null;
    }

    const validPaymentMethods = ['card', 'upi', 'cod'];
    if (!validPaymentMethods.includes(paymentMethod)) {
        res.status(400).json({ error: 'Invalid payment method' });
        return null;
    }

    const cleanItems = items.map((item) => ({
        productId: String(item.productId || item.id || ''),
        name: String(item.name || 'Product'),
        price: toNumber(item.price),
        quantity: Math.max(1, Math.floor(toNumber(item.quantity))),
        image: String(item.image || ''),
    })).filter((item) => item.productId && item.price >= 0 && item.quantity > 0);

    if (!cleanItems.length) {
        res.status(400).json({ error: 'No valid products found in cart' });
        return null;
    }

    const subtotal = cleanItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const orderId = `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    return {
        orderId,
        userId,
        email,
        items: cleanItems,
        deliveryDetails: {
            firstName: String(deliveryDetails.firstName || '').trim(),
            lastName: String(deliveryDetails.lastName || '').trim(),
            phone: String(deliveryDetails.phone || '').trim(),
            address: String(deliveryDetails.address || '').trim(),
            city: String(deliveryDetails.city || '').trim(),
            pincode: String(deliveryDetails.pincode || '').trim(),
            instructions: String(deliveryDetails.instructions || '').trim(),
        },
        paymentMethod,
        subtotal,
        tax,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };
}

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const orderData = cleanOrderPayload(req, res);
        if (!orderData) return;

        if (!isDatabaseReady()) {
            const store = readStore();
            const localOrder = { _id: createId(), ...orderData };
            store.orders.unshift(localOrder);
            writeStore(store);
            return res.status(201).json({ message: 'Order placed successfully', order: localOrder });
        }

        const order = new Order(orderData);
        const savedOrder = await order.save();
        res.status(201).json({
            message: 'Order placed successfully',
            order: savedOrder
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(400).json({ error: error.message || 'Failed to create order' });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (String(req.user?.userId) !== String(userId)) {
            return res.status(403).json({ error: 'You can only view your own orders' });
        }

        if (!isDatabaseReady()) {
            const store = readStore();
            const orders = store.orders.filter((order) => String(order.userId) === String(userId));
            return res.json(orders);
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Get single order
exports.getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!isDatabaseReady()) {
            const store = readStore();
            const order = store.orders.find((item) => item.orderId === orderId);
            if (!order) return res.status(404).json({ error: 'Order not found' });
            if (String(order.userId) !== String(req.user?.userId)) {
                return res.status(403).json({ error: 'You can only view your own order' });
            }
            return res.json(order);
        }

        const order = await Order.findOne({ orderId }).lean();

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (String(order.userId) !== String(req.user?.userId)) {
            return res.status(403).json({ error: 'You can only view your own order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// Update order status (admin only placeholder)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        if (!isDatabaseReady()) {
            const store = readStore();
            const index = store.orders.findIndex((item) => item.orderId === orderId);
            if (index === -1) return res.status(404).json({ error: 'Order not found' });
            store.orders[index].status = status;
            writeStore(store);
            return res.json(store.orders[index]);
        }

        const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update order' });
    }
};

// Get all orders (admin placeholder)
exports.getAllOrders = async (req, res) => {
    try {
        if (!isDatabaseReady()) {
            return res.json(readStore().orders);
        }

        const orders = await Order.find().sort({ createdAt: -1 }).lean();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

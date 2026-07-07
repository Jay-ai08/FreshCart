const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getOrder,
    updateOrderStatus,
    getAllOrders
} = require('../controllers/orderController');
const authenticateToken = require('../middleware/authMiddleware');

// User routes
router.post('/orders', authenticateToken, createOrder);
router.get('/orders/user/:userId', authenticateToken, getUserOrders);
router.get('/orders/:orderId', authenticateToken, getOrder);

// Admin routes placeholder
router.put('/orders/:orderId/status', authenticateToken, updateOrderStatus);
router.get('/orders', authenticateToken, getAllOrders);

module.exports = router;

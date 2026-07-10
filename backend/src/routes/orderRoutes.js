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
const requireAdmin = require('../middleware/adminMiddleware');

// User routes
router.post('/orders', authenticateToken, createOrder);
router.get('/orders/user/:userId', authenticateToken, getUserOrders);
router.get('/orders/:orderId', authenticateToken, getOrder);

// Admin routes
router.put('/orders/:orderId/status', authenticateToken, requireAdmin, updateOrderStatus);
router.get('/orders', authenticateToken, requireAdmin, getAllOrders);

module.exports = router;

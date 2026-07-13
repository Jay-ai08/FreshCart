const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/paymentController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/payment/create-order', authenticateToken, createRazorpayOrder);
router.post('/payment/verify', authenticateToken, verifyRazorpayPayment);

module.exports = router;
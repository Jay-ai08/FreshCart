const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

// User routes (require authentication)
router.get('/users/:userId', authenticateToken, getUserProfile);
router.put('/users/:userId', authenticateToken, updateUserProfile);

module.exports = router;

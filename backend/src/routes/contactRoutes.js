const express = require('express');
const router = express.Router();
const {
    submitContact,
    getAllContacts,
    getContact,
    updateContactStatus
} = require('../controllers/contactController');
const authenticateToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// Public route
router.post('/contact', submitContact);

// Admin routes
router.get('/contacts', authenticateToken, requireAdmin, getAllContacts);
router.get('/contacts/:id', authenticateToken, requireAdmin, getContact);
router.put('/contacts/:id/status', authenticateToken, requireAdmin, updateContactStatus);

module.exports = router;

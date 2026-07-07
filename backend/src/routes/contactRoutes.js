const express = require('express');
const router = express.Router();
const {
    submitContact,
    getAllContacts,
    getContact,
    updateContactStatus
} = require('../controllers/contactController');

// Public route
router.post('/contact', submitContact);

// Admin routes
router.get('/contacts', getAllContacts);
router.get('/contacts/:id', getContact);
router.put('/contacts/:id/status', updateContactStatus);

module.exports = router;

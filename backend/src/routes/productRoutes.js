const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductsByCategory,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// Public routes
router.get('/products', getAllProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProduct);

// Admin routes
router.post('/products', authenticateToken, requireAdmin, createProduct);
router.put('/products/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/products/:id', authenticateToken, requireAdmin, deleteProduct);

module.exports = router;

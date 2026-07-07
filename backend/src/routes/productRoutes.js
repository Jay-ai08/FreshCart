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

// Public routes
router.get('/products', getAllProducts);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProduct);

// Admin routes (would need admin middleware)
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;

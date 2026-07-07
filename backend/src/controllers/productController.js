const mongoose = require('mongoose');
const Product = require('../models/productModel');
const { productsByCategory, allProducts } = require('../data/products');

const validCategories = Object.keys(productsByCategory);
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

function sendCached(res, key, data) {
    cache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
    res.set('Cache-Control', 'public, max-age=60');
    return res.json(data);
}

function getCached(key) {
    const item = cache.get(key);
    if (!item) return null;
    if (item.expires < Date.now()) {
        cache.delete(key);
        return null;
    }
    return item.data;
}

function isDatabaseReady() {
    return mongoose.connection.readyState === 1;
}

function fallbackProducts(category) {
    if (category) return productsByCategory[category] || [];
    return allProducts;
}

// Get all products
exports.getAllProducts = async (req, res) => {
    const cacheKey = 'products:all';
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    try {
        if (!isDatabaseReady()) {
            return sendCached(res, cacheKey, fallbackProducts());
        }

        const products = await Product.find({ inStock: { $ne: false } })
            .select('-__v')
            .sort({ category: 1, createdAt: 1 })
            .lean();

        return sendCached(res, cacheKey, products.length ? products : fallbackProducts());
    } catch (error) {
        return sendCached(res, cacheKey, fallbackProducts());
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    const cacheKey = `products:category:${category}`;

    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
    }

    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    try {
        if (!isDatabaseReady()) {
            return sendCached(res, cacheKey, fallbackProducts(category));
        }

        const products = await Product.find({ category, inStock: { $ne: false } })
            .select('-__v')
            .sort({ createdAt: 1 })
            .lean();

        return sendCached(res, cacheKey, products.length ? products : fallbackProducts(category));
    } catch (error) {
        return sendCached(res, cacheKey, fallbackProducts(category));
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    const { id } = req.params;
    const cacheKey = `products:id:${id}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    try {
        if (isDatabaseReady()) {
            const product = await Product.findOne({ id }).select('-__v').lean();
            if (product) return sendCached(res, cacheKey, product);
        }

        const product = allProducts.find((item) => item.id === id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return sendCached(res, cacheKey, product);
    } catch (error) {
        const product = allProducts.find((item) => item.id === id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return sendCached(res, cacheKey, product);
    }
};

// Create product (admin only)
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        cache.clear();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to create product' });
    }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndUpdate({ id }, req.body, { new: true, runValidators: true });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        cache.clear();
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to update product' });
    }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndDelete({ id });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        cache.clear();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

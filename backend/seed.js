require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/productModel');
const { allProducts } = require('./src/data/products');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freshcart';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(allProducts);
        console.log(`Successfully seeded ${allProducts.length} products`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();

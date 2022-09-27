const express = require('express');
const productRouter = express.Router();
const auth = require('../middlewares/auth');
const Product = require('../models/product');

// Get all product by category
productRouter.get('/api/products', auth, async (req, res) => {
    try {
        const category = req.query.category;
        const products = await Product.find({category: category});
        res.json(products);
    } catch(e) {
        console.log('error: ', e);
        res.status(500).json({msg: e.message});
    }
});

// Search Product
productRouter.get('/api/products/search/:name', auth, async (req, res) => {
    try {
        const searchQuery = req.params.name;
        console.log('search: ', searchQuery);
        const products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' },
        });
        res.json(products);
    } catch(e) {
        console.log('error: ', e);
        res.status(500).json({msg: e.message});
    }
});

module.exports = productRouter;

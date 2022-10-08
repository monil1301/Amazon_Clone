const express = require('express');
const admin = require('../middlewares/admin');
const { Product } = require('../models/product');

const adminRouter = express.Router();

// Add Product
adminRouter.post('/admin/addProduct', admin, async (req, res) => {
    try {
        const {name, description, images, price, quantity, category} = req.body;
        let product = new Product({name, description, images, price, quantity, category});

        product = await product.save();
        res.json(product);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// Get All Products
adminRouter.get('/admin/allProducts', admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch(e) {
        res.status(500).json({error: e.message})
    }
});

// Delete Product
adminRouter.post('/admin/deleteProduct', admin, async (req, res) => {
    try {
        const {_id} = req.body;
        let product = await Product.findByIdAndDelete(_id);
        res.json(product);
    } catch(e) {
        console.log(e.message);
        res.status(500).json({error: e.message})
    }
});

module.exports = adminRouter;

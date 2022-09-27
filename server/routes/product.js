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
        const products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' },
        });
        res.json(products);
    } catch(e) {
        console.log('error: ', e);
        res.status(500).json({msg: e.message});
    }
});

// rate product
productRouter.post('/api/product/rate', auth, async (req, res) => {
    try {
        const {id, rating} = req.body;
        let product = await Product.findById(id);

        for(i=0; i < product.ratings.length; i++) {
            if (product.ratings[i].userId == req.user) {
                product.ratings.splice(i, 1);
                break;
            }
        }

        const ratingSchema = {
            userId: req.user,
            rating
        }

        product.ratings.push(ratingSchema);
        product = await product.save();
        res.json(product);
    } catch(e) {
        console.log('error: ', e);
        res.status(500).json({msg: e.message});
    }
});

// Deal of the day
productRouter.get('/api/dealOfDay', auth, async (req, res) => {
    try {
        let products = await Product.find({});

        products = products.sort((a, b) => {
            let aSum = 0;
            let bSum = 0;

            a.ratings.forEach(element => {
                aSum += element.rating;
            });

            b.ratings.forEach(element => {
                bSum += element.rating;
            });

            return aSum < bSum ? 1 : -1;
        });

        res.json(products[0]);
    } catch(e) {
        console.log('error: ', e);
        res.status(500).json({msg: e.message});
    }
});

module.exports = productRouter;

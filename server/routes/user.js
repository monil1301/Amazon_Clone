const express = require('express');
const auth = require('../middlewares/auth');
const Order = require('../models/order');
const { Product } = require('../models/product');
const User = require('../models/user');

const userRouter = express.Router();

// Add to cart
userRouter.post('/api/addToCart', auth, async (req, res) => {
    try {
        const {_id} = req.body;
        const product = await Product.findById(_id);
        let user = await User.findById(req.user);

        if(user.cart.length == 0) {
            user.cart.push({ product, quantity: 1});
        } else {
            let isProductFound = false;
            for(let i=0; i<user.cart.length; i++) {
                if(user.cart[i].product._id.equals(product._id)) {
                    isProductFound = true;       
                }
            }

            if(isProductFound) {
                let _product = user.cart.find((productt) => 
                    productt.product._id._id.equals(product._id)
                );
                _product.quantity += 1;
            } else {
                user.cart.push({ product, quantity: 1});
            }
        }

        user = await user.save();
        res.json(user);
    } catch(e) {
        console.log('error: ', e);
        res.status(500).json({msg: e.message});
    }
});

// Remove from cart
userRouter.delete('/api/removeFromCart/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        let user = await User.findById(req.user);

        for(let i=0; i<user.cart.length; i++) {
            if(user.cart[i].product._id.equals(id)) {
                if (user.cart[i].quantity > 1) {
                    user.cart[i].quantity -= 1;
                } else {
                    user.cart.splice(i, 1);
                }
            }
        }

        user = await user.save();
        res.json(user);
    } catch(e) {
        console.log('error: ', e);
        res.status(500).json({msg: e.message});
    }
});

// Add address
userRouter.post('/api/addAddress', auth, async (req, res) => {
    try {
        const { address } = req.body;
        let user = await User.findById(req.user);

        user.address = address;
        user = await user.save();
        res.json(user);
    } catch(e) {
        console.log('error: ', e);
        res.status(500).json({msg: e.message});
    }
});

// Place order
userRouter.post('/api/order', auth, async (req, res) => {
    try {
        const { products: cart, totalPrice, address, paymentStatus } = req.body;
        let user = await User.findById(req.user);
        let products = [];

        for (let i = 0; i < cart.length; i++) {
            let product = await Product.findById(cart[i].product._id);
            if(product.quantity >= cart[i].quantity) {
                product.quantity -= cart[i].quantity;
                products.push({product, quantity: cart[i].quantity});
                await product.save();
            } else {
                res.status(400).json({msg: `${product.name} is out of stock!`});
            }
        }

        user.cart = [];
        user = await user.save();

        let order = new Order({
            products,
            totalPrice,
            address,
            userId: req.user,
            orderedAt: new Date().getTime(),
            paymentStatus
        });

        order = await order.save();
        res.json(order);
    } catch(e) {
        console.log('error: ', e);
        res.status(500).json({msg: e.message});
    }
});

module.exports = userRouter;

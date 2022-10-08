const express = require('express');
const auth = require('../middlewares/auth');
const { Product } = require('../models/product');
const User = require('../models/user');

const userRouter = express.Router();

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

module.exports = userRouter;
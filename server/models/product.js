const mongoose = require('mongoose');
const ratingSchema = require('./rating');

const productSchema = mongoose.Schema({
    name: {
        require: true,
        type: String,
        trim: true
    },
    description: {
        require: true,
        type: String,
        trim: true
    },
    images: [
        {
            require: true,
            type: String,
            trim: true
        }
    ],
    price: {
        require: true,
        type: Number
    },
    quantity: {
        require: true,
        type: Number
    },
    category: {
        require: true,
        type: String
    },
    ratings: [ratingSchema]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

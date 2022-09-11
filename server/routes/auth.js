const express = require('express');
const bcryptJs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middlewares/auth');

const authRouter = express.Router();

// Sign Up
authRouter.post('/api/signUp', async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
           return res.status(400).json({
                 msg: "User with same email already exists!"
            });
        }

        const hashedPassword = await bcryptJs.hash(password, 7);

        let user = new User({name, email, password: hashedPassword});
        user = await user.save();

        const token = jwt.sign({id: user._id}, "panipuri");
        res.json({token, ...user._doc});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// Sign In
authRouter.post('/api/signIn', async (req, res) => {
    try {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});
    if(!user) {
        return res.status(400).json({
            msg: "User with this email does not exists!"
       });
    }

    const doesPasswordMatch = await bcryptJs.compare(password, user.password);
    if(!doesPasswordMatch) {
        return res.status(400).json({
            msg: "Incorrect password"
       });
    } 

    const token = jwt.sign({id: user._id}, "panipuri");
    res.json({token, ...user._doc});

    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// Token validation
authRouter.post('/isTokenValid', async (req, res) => {
    try {
        const authorization = req.headers.authorization;
        var token = null;

        if(authorization && authorization.startsWith("Bearer ")) token = authorization.substring(7, authorization.length);

        if (!token) return res.json(false);

        const isVerified = jwt.verify(token, 'panipuri');
        if (!isVerified) return res.json(false);

        const user = User.findById(isVerified.id);
        if (!user) return res.json(false);
    
        res.json(true);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// get user data
authRouter.get("/user", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({...user._doc});
});

module.exports = authRouter;
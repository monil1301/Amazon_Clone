const jwt = require('jsonwebtoken');
const User = require('../models/user');

const admin = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        var token = null;

        if(authorization && authorization.startsWith("Bearer ")) token = authorization.substring(7, authorization.length);

        if (!token) return res.status(401).json({msg: "No token passed, access denied"});

        const isVerified = jwt.verify(token, 'panipuri');
        if (!isVerified) return res.status(401).json({msg: "Invalid token, access denied"});

        const user = await User.findById(isVerified.id);
        if (user.type == "user" || user.type == "seller") return res.status(401).json({msg: "Not an admin, access denied"});

        req.user = user.id;
        next();
    } catch(e) {
        res.status(500).json({error: e.message});
    }
}

module.exports = admin;

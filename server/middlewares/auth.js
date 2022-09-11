const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        var token = null;

        if(authorization && authorization.startsWith("Bearer ")) token = authorization.substring(7, authorization.length);

        if (!token) return res.status(401).json({msg: "No token passed, access denied"});

        const isVerified = jwt.verify(token, 'panipuri');
        if (!isVerified) return res.status(401).json({msg: "Invalid token, access denied"});

        req.user = isVerified.id;
        req.token = token;
        next();
    } catch(e) {
        res.status(500).json({error: e.message});
    }
}

module.exports = auth;
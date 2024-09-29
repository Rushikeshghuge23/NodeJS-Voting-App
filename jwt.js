const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unauthorized'});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach user infoormation to the request object
        req.user = decoded;
        next();
    } catch(err){
        console.log(err);
        res.status(401).json({error: 'Invalid token'});
    }
};

//function to generate a new JWT token using user data
const generateToken = (userData) => {
    //generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000});
}

module.exports = {jwtAuthMiddleware, generateToken};
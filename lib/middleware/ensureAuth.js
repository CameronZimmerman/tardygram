 const {verifyToken} = require('../utils/jwt');
 
 module.exports = async(req,res,next) => {
    const {session} = req.cookies;
    try {
        const user = await verifyToken(session);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    } 
 }

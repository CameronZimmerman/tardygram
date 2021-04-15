const JWT = require('jsonwebtoken');


const getToken = async (payload) => JWT.sign({...payload}, process.env.APP_SECRET, {expiresIn: '24hr'});

const verifyToken = async (token) => JWT.verify(token, process.env.APP_SECRET);

module.exports = {
    getToken,
    verifyToken
}

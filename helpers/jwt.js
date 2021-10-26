const expressJwt = require('express-jwt');
require('dotenv/config');

function authJwt() {
    const secret = process.env.JWT_SECURITY_KEY;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
    });
}

module.exports = authJwt;

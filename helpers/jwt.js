const expressJwt = require('express-jwt');
require('dotenv/config');

function authJwt() {
    const secret = process.env.JWT_SECURITY_KEY;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            '/api/v1/auth/login',
            '/api/v1/auth/register',
        ],
    });
}

module.exports = authJwt;

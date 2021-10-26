const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const UserModel = require('../models/User');

router.post(`/login`, async (req, res) => {
    const user = await UserModel.findOne({ username: req.body.username });
    const JWT_SECURITY_KEY = process.env.JWT_SECURITY_KEY;

    if (!user) {
        return res.status(400).json('The user not found!');
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                userId: user.id,
            },
            JWT_SECURITY_KEY,
            { expireIn: '1d' }
        );

        res.status(200).send({ user: user.username, token: token });
    } else {
        res.status(400).send('password is wrong!');
    }
});

module.exports = router;

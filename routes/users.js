const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
require('dotenv/config');

const UserModel = require('../models/User');

router.get(`/`, async (req, res) => {
    const users = await UserModel.find().select('name username phone email');

    if (!users) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(users);
});

router.get(`/:id`, async (req, res) => {
    const user = await UserModel.findById(req.params.id).select('-password');

    if (!user) {
        res.status(500).json({
            success: false,
            message: 'User not found!',
        });
    }

    res.status(200).json(user);
});

router.post(`/`, async (req, res) => {
    let user = new UserModel({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        address: req.body.address,
        postalCode: req.body.postalCode,
        city: req.body.city,
        country: req.body.country,
    });
    user = await user.save();

    if (!user) {
        return res.status(400).send('Creating user failed!');
    }

    res.send(user);
});

module.exports = router;

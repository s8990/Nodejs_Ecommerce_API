const express = require('express');
const router = express.Router();

const UserModel = require('../models/User');

router.get(`/`, async (req, res) => {
    const users = await UserModel.find();

    if (!users) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(users);
});

router.post(`/`, async (req, res) => {
    let user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        passwordHashed: req.body.passwordHashed,
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

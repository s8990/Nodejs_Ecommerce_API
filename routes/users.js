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

router.get(`/get/count`, async (req, res) => {
    try {
        const userCount = await UserModel.countDocuments((count) => count);

        if (!userCount) {
            res.status(500).json({ success: false });
        }

        res.status(200).json({
            userCount: userCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error,
        });
    }
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

router.delete('/:id', (req, res) => {
    UserModel.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (user) {
                return res.status(200).json({
                    success: true,
                    message: 'The user is deleted',
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'User not found!' });
            }
        })
        .catch((error) => {
            return res.status(400).json({ success: false, error: error });
        });
});

module.exports = router;

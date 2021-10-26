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

module.exports = router;

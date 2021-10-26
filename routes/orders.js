const express = require('express');
const router = express.Router();

const OrderModel = require('../models/Order');

router.get(`/`, async (req, res) => {
    const orders = await OrderModel.find();

    if (!orders) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(orders);
});

module.exports = router;

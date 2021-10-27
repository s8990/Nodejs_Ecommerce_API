const express = require('express');
const router = express.Router();

const OrderModel = require('../models/Order');
const OrderItemModel = require('../models/OrderItem');

router.get(`/`, async (req, res) => {
    const orders = await OrderModel.find()
        .populate('user', 'username')
        .sort({ dateOrdered: -1 });

    if (!orders) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(orders);
});

router.get(`/:id`, async (req, res) => {
    const order = await OrderModel.findById(req.params.id)
        .populate('user', 'username')
        .populate({
            path: 'orderItems',
            populate: { path: 'product', populate: 'category' },
        });

    if (!order) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(order);
});

router.post(`/`, async (req, res) => {
    try {
        const orderItemsIds = Promise.all(
            req.body.orderItems.map(async (orderItem) => {
                let newOrderItem = new OrderItemModel({
                    quantity: orderItem.quantity,
                    product: orderItem.product,
                });

                newOrderItem = await newOrderItem.save();
                return newOrderItem._id;
            })
        );
        const orderItemsIdsResolved = await orderItemsIds;

        console.log(orderItemsIds);
        let order = new OrderModel({
            orderItems: orderItemsIdsResolved,
            shippingAddress: req.body.shippingAddress,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            user: req.body.user,
        });
        order = await order.save();

        if (!order) {
            return res.status(400).send('Creating order failed!');
        }

        res.send(order);
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        });
    }
});

module.exports = router;

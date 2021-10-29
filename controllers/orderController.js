const OrderModel = require('../models/Order');
const OrderItemModel = require('../models/OrderItem');

const { validateCreateOrder } = require('../helpers/validators/OrderValidator');

const getOrders = async (req, res) => {
    const orders = await OrderModel.find()
        .populate('user', 'username')
        .sort({ dateOrdered: -1 });

    if (!orders) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(orders);
};

const getOrderById = async (req, res) => {
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
};

const addOrder = async (req, res) => {
    try {
        const { error } = validateCreateOrder(req.body);
        if (error) {
            return res.status(400).json({ error: error });
        }
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

        const totalPrices = await Promise.all(
            orderItemsIdsResolved.map(async (orderItemId) => {
                const orderItem = await OrderItemModel.findById(
                    orderItemId
                ).populate('product', 'price');
                const totalPrice = orderItem.product.price * orderItem.quantity;
                return totalPrice;
            })
        );

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        let order = new OrderModel({
            orderItems: orderItemsIdsResolved,
            shippingAddress: req.body.shippingAddress,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
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
};

const editOrder = async (req, res) => {
    const order = await OrderModel.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        { new: true }
    );

    if (!order) {
        return res.status(500).send('Updating order failed!');
    }

    res.send(order);
};

const deleteOrder = (req, res) => {
    OrderModel.findByIdAndRemove(req.params.id)
        .then(async (order) => {
            if (order) {
                await order.orderItems.map(async (orderItem) => {
                    await OrderItemModel.findByIdAndRemove(orderItem);
                });

                return res.status(200).json({
                    success: true,
                    message: 'The order is deleted',
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'Order not found!' });
            }
        })
        .catch((error) => {
            return res.status(500).json({ success: false, error: error });
        });
};

const getTotalSales = async (req, res) => {
    try {
        const totalSales = await OrderModel.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
        ]);

        if (!totalSales) {
            return res.status(400).send('The order sales cannot be generated');
        }

        res.status(200).json({
            success: true,
            totalSales: totalSales.pop().totalSales,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error,
        });
    }
};

const getOrdersCount = async (req, res) => {
    try {
        const orderCount = await OrderModel.countDocuments((count) => count);

        if (!orderCount) {
            res.status(500).json({ success: false });
        }

        res.status(200).json({
            orderCount: orderCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};

const getUserOrders = async (req, res) => {
    const userOrders = await OrderModel.find({
        user: req.params.userId,
    })
        .populate({
            path: 'orderItems',
            populate: { path: 'product', populate: 'category' },
        })
        .sort({ dateOrdered: -1 });

    if (!userOrders) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(userOrders);
};

module.exports = {
    getOrders,
    getOrderById,
    addOrder,
    editOrder,
    deleteOrder,
    getTotalSales,
    getOrdersCount,
    getUserOrders,
};

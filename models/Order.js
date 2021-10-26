const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({});

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;

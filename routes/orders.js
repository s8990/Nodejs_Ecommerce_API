const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get(`/`, orderController.getOrders);

router.get(`/:id`, orderController.getOrderById);

router.post(`/`, orderController.addOrder);

router.put('/:id', orderController.editOrder);

router.delete('/:id', orderController.deleteOrder);

router.get('/get/totalSales', orderController.getTotalSales);

router.get(`/get/count`, orderController.getOrdersCount);

router.get(`/get/userOrders/:userId`, orderController.getUserOrders);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get(`/`, userController.getUsers);

router.get(`/:id`, userController.getUserById);

router.get(`/get/count`, userController.getUsersCount);

router.post(`/`, userController.addUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;

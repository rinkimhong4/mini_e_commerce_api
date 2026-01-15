const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');

// Get all orders
router.get('/api/orders', orderController.getAllOrders);

// Get orders by user
router.get('/api/user/:userId', orderController.getOrdersByUser);

// Get order by id
router.get('/api/orders/:id', orderController.getOrderById);

router.post('/api/orders', orderController.createOrder);

//  
router.put('/api/orders/:id/status', orderController.updateOrderStatus);

router.delete('/api/orders/:id', orderController.deleteOrder);

module.exports = router;
const express = require('express');
const router = express.Router();
const cartController = require('../controller/card.item.controller');

router.post('/api/cart', cartController.addToCart);

router.get('/api/user/:userId', cartController.getUserCart);

router.put('/api/cart/:id', cartController.updateCartItem);

router.delete('/api/cart/:id', cartController.removeCartItem);

router.delete('/user/:userId/clear', cartController.clearUserCart);

module.exports = router;
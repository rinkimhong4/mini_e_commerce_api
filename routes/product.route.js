var express = require('express');
var router = express.Router();
const productController = require('../controller/product.controller'); 
const upload = require("../middleware/upload");


router.post('/api/products',
    upload.single("image"),
    productController.createProduct);
//
// GET all attendance records
router.get("/api/products/search/", productController.searchProduct);

router.get('/api/products/', productController.getAllProduct);
router.get('/api/products/:id', productController.getProductByID);
//
router.put('/api/products/:id', productController.updateProduct);
// // 
router.delete('/api/products/:id', productController.deleteProduct);

module.exports = router;

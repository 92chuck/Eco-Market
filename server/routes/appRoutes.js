const express = require('express');
const router = express.Router();
const veggieController = require('../controllers/veggieController');
const userController = require('../controllers/userController');

/**
 *  App Routes
 */

router.get('/', veggieController.homepage);
router.get('/products', veggieController.products);
router.get('/product/:id', veggieController.productById);
router.get('/categories', veggieController.productCategories);
router.get('/categories/:id', veggieController.productByCategory);
router.get('/brands', veggieController.productBrands);
router.get('/brands/:id', veggieController.productByBrand);
router.post('/search', veggieController.searchProducts);

/**
 *  App Routes
 */

router.get('/register', userController.register);
router.get('/login', userController.login);
router.post('/register', userController.registerPost);
router.post('/login', userController.loginPost);

module.exports = router;

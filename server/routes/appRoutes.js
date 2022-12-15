const express = require('express');
const router = express.Router();
const veggieController = require('../controllers/veggieController');
const userController = require('../controllers/userController');
const { validateToken, isAdmin } = require('../middleware/JWT');
/**
 *  Vegetable Routes
 */

router.get('/', validateToken, veggieController.homepage);
router.get('/products', validateToken, veggieController.products);
router.get('/product/:id', validateToken, veggieController.productById);
router.get('/categories', validateToken, veggieController.productCategories);
router.get(
  '/categories/:id',
  validateToken,
  veggieController.productByCategory
);
router.get('/brands', validateToken, veggieController.productBrands);
router.get('/brands/:id', validateToken, veggieController.productByBrand);
router.post('/search', validateToken, veggieController.searchProducts);

/**
 *  User Routes
 */

router.get('/register', validateToken, userController.register);
router.get('/login', validateToken, userController.login);
router.get('/logout', userController.logout);
router.post('/register', validateToken, userController.registerPost);
router.post('/login', validateToken, userController.loginPost);
router.get('/admin', isAdmin, userController.admin);

module.exports = router;

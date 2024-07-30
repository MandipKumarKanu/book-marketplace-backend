const express = require('express');
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/add', auth, cartController.addToCart);
router.delete('/remove/:bookId', auth, cartController.removeFromCart);
router.get('/', auth, cartController.getCart);
router.post('/checkout', auth, cartController.checkout);

module.exports = router;

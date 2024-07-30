const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const uploadProfile = require('../middleware/upload');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/refresh', userController.refreshToken);
router.post('/logout', userController.logout);
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, uploadProfile.single('profilePicture'), userController.updateProfile);
router.get('/purchased', auth, userController.getPurchasedBooks);

module.exports = router;
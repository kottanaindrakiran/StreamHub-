const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, require('../controllers/authController').updateUserProfile);
router.get('/users', protect, authorize('admin', 'editor'), require('../controllers/authController').getUsers);
router.put('/users/:id/role', protect, authorize('admin'), require('../controllers/authController').updateUserRole);

module.exports = router;

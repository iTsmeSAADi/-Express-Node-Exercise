const express = require('express');
const router = express.Router();
const userController = require('../controllers/User.Controllers');

// Route to create a user
router.post('/users', userController.createUser);

// Route to generate OTP
router.post('/users/generateOTP', userController.generateOTP);

// Route to verify OTP
router.get('/users/:user_id/verifyOTP', userController.verifyOTP);

// Route to handle incorrect routes
router.use('*', (req, res) => {
    res.status(404).json({ error: 'Route does not exist' });
});
  
module.exports = router;

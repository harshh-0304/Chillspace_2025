const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// Route for creating Razorpay order
router.post('/create-order', createOrder);

// Route for verifying payment
router.post('/verify-payment', verifyPayment);

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: '/tmp' });

const {
  register,
  login,
  logout,
  googleLogin,
  uploadPicture,
  updateUserDetails,
  getAllUsers, // Added the getAllUsers import
} = require('../controllers/userController');

// Define the routes
router.route('/').get(getAllUsers); // Correctly using the getAllUsers function
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/google/login').post(googleLogin);
router.route('/upload-picture').post(upload.single('picture', 1), uploadPicture);
router.route('/update-user').put(updateUserDetails);
router.route('/logout').get(logout);

module.exports = router;

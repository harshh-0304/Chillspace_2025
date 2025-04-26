const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const upload = multer({ dest: "/tmp" });

const {
  register,
  login,
  logout,
  googleLogin,
  uploadPicture,
  updateUserDetails,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserProfile,
  registerAdmin,
  createAdmin,
} = require("../controllers/userController");

// Public routes (no authentication required)
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/google/login").post(googleLogin);
router.route("/logout").get(logout);

// Special admin registration with security code
router.route("/register-admin").post(registerAdmin);

// Protected routes (authentication required)
router.route("/profile").get(isLoggedIn, getUserProfile);
router
  .route("/upload-picture")
  .post(isLoggedIn, upload.single("picture", 1), uploadPicture);
router.route("/update-user").put(isLoggedIn, updateUserDetails);

// Admin-only routes
router.route("/").get(isLoggedIn, isAdmin, getAllUsers);
router.route("/update-role").put(isLoggedIn, isAdmin, updateUserRole);
router.route("/create-admin").post(isLoggedIn, isAdmin, createAdmin);
router.route("/delete/:userId").delete(isLoggedIn, isAdmin, deleteUser);

module.exports = router;

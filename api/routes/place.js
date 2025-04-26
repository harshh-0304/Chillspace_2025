const express = require("express");
const router = express.Router();
const { isLoggedIn, hasRole } = require("../middlewares/auth");

const {
  addPlace,
  getPlaces,
  updatePlace,
  singlePlace,
  userPlaces,
  searchPlaces,
  deletePlace,
} = require("../controllers/placeController");

// Public routes
router.route("/").get(getPlaces);
router.route("/:id").get(singlePlace);
router.route("/search/:key").get(searchPlaces);

// Protected routes (user must be logged in)
// Only hosts and admins can add places (role check is in controller)
router.route("/add-places").post(isLoggedIn, addPlace);

// User specific routes
router.route("/user-places/:id").get(isLoggedIn, userPlaces);

// Update route (ownership or admin check is in controller)
router.route("/update-place").put(isLoggedIn, updatePlace);

// Delete route (ownership or admin check is in controller)
router.route("/delete-place/:id").delete(isLoggedIn, deletePlace);

module.exports = router;

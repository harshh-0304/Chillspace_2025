const express = require("express");
const {
  createReview,
  getReviewsByPlace,
  deleteReview,
} = require("../controllers/reviewController");
const { isLoggedIn } = require("../middlewares/auth");

const router = express.Router();

router.post("/:placeId", isLoggedIn, createReview);
router.get("/:placeId", getReviewsByPlace);
router.delete("/:reviewId", isLoggedIn, deleteReview);

module.exports = router;

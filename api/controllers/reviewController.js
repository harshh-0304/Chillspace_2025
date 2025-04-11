const Review = require('../models/Review');

// Create a review
exports.createReview = async (req, res) => {
  const { placeId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.create({
      user: req.user._id,
      place: placeId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
};

// Get all reviews for a place
exports.getReviewsByPlace = async (req, res) => {
  const { placeId } = req.params;

  try {
    const reviews = await Review.find({ place: placeId }).populate('user', 'name picture');
    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await review.remove();
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};

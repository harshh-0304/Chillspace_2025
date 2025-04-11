// components/ReviewForm.jsx
import React, { useState } from 'react';
// import axios from 'axios';
import axios from "../lib/axios"

const ReviewForm = ({ placeId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/reviews/${placeId}`, {
        rating,
        comment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRating(5);
      setComment('');
      onReviewAdded(); // Refresh reviews
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <h3 className="text-lg font-semibold">Leave a Review</h3>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write something cool..."
        className="border p-2 w-full"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;

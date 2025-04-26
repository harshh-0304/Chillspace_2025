// components/ReviewList.jsx
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import axios from "../lib/axios"
const ReviewList = ({ placeId }) => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/reviews/${placeId}`);
      setReviews(data.reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchReviews(); // Refresh after delete
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Not allowed or failed.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [placeId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Reviews</h3>
      {reviews.length === 0 && <p>No reviews yet. Be the first, legend.</p>}
      {reviews.map((review) => (
        <div key={review._id} className="border p-3 mb-3 rounded shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{review.user?.name || "Anonymous"}</p>
              <p className="text-yellow-600">
                {Array.from({ length: review.rating }, (_, i) => (
                 <span key={i}>⭐</span>
                 ))}
               </p>
            </div>
            {review.user?._id === JSON.parse(localStorage.getItem("user"))?._id && (
              <button
                onClick={() => deleteReview(review._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
          <p className="mt-2">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, User } from 'lucide-react';
import { API_URL } from '../config';

const ReviewList = ({ serviceId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Assuming we have an endpoint to get reviews for a service
        // If not, we might need to update the backend.
        // The service object usually contains reviews if populated, 
        // or we can add an endpoint GET /api/services/:id/reviews
        // For now, let's assume the service details endpoint returns reviews or we fetch from service

        // Actually, in many MERN tutorials, reviews are part of the service object.
        // Let's check the Service model or controller.
        // If not, I'll use the service details endpoint which likely includes them.

        const { data } = await axios.get(`${API_URL}/api/services/${serviceId}`);
        if (data.reviews) {
          setReviews(data.reviews);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [serviceId]);

  if (loading) return <div className="h-20 animate-pulse bg-gray-50 rounded"></div>;
  if (reviews.length === 0) return (
    <div className="text-center text-gray-500 py-8 italic">
      No reviews yet. Be the first to review!
    </div>
  );

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        Reviews <span className="text-sm font-normal text-gray-500">({reviews.length})</span>
      </h3>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  {review.name ? review.name.charAt(0) : 'U'}
                </div>
                <span className="font-semibold text-gray-700">{review.name}</span>
              </div>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold">{review.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;

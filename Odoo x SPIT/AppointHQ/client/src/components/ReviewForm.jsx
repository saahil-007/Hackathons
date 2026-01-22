import React, { useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { API_URL } from '../config';

const ReviewForm = ({ serviceId, serviceName, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      if (!token) throw new Error('Not authenticated');

      await axios.post(
        `${API_URL}/api/services/${serviceId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsOpen(false);
      setComment('');
      setRating(5);
      onReviewSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50 flex items-center gap-2"
      >
        <Star className="w-4 h-4" />
        Rate & Review
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Review {serviceName}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { API_URL } from '../config';

const ForgotPasswordOTP = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await axios.post(`${API_URL}/api/otp/forgot-password`, { email });
      setMessage('OTP sent to your email. Please check your inbox.');
      // Navigate to reset password page
      setTimeout(() => {
        navigate('/reset-password-otp', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-200 border-t-4 border-t-blue-600">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Forgot Password
            </h2>
            <p className="text-gray-600">
              Enter your email to receive a verification OTP
            </p>
          </div>

          <AnimatePresence mode='wait'>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-600 p-3 mb-4 rounded-md text-sm flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" /> {error}
              </motion.div>
            )}
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-50 text-green-600 p-3 mb-4 rounded-md text-sm flex items-center gap-2"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {!message && (
            <motion.form
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Send OTP'}
              </button>
            </motion.form>
          )}

          <div className="flex justify-center border-t border-gray-200 pt-4 mt-6">
            <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordOTP;
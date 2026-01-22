import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, AlertCircle, KeyRound } from 'lucide-react';
import { API_URL } from '../config';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithData } = useAuth();

  const email = location.state?.email;

  if (!email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Invalid access</h2>
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-800 transition-colors">Go to Login</button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${API_URL}/api/otp/verify-otp`, {
        email,
        otp
      });
      loginWithData(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-md"
      >
        <div className="w-full bg-white rounded-lg shadow-2xl p-8 border border-gray-200 border-t-4 border-t-blue-600">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4"
            >
              <Mail className="h-10 w-10 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Verify Email</h2>
            <p className="text-sm text-gray-600 mt-2">
              Enter the 6-digit OTP sent to <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="pl-9 text-center text-lg tracking-widest w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 h-12 text-lg text-white rounded-md font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="inline mr-2 h-5 w-5 animate-spin" /> Verifying...
                  </>
                ) : 'Verify'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;

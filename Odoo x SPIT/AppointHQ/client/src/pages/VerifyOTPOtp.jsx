import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, AlertCircle, KeyRound, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const VerifyOTPOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithData } = useAuth();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data } = await axios.post(`${API_URL}/api/otp/verify-otp`, {
        email,
        otp
      });
      
      setSuccess(true);
      // Auto-login after successful verification
      loginWithData(data);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-200 border-t-4 border-t-green-500">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h2>
            <p className="text-gray-600 mb-6">Redirecting to your dashboard...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
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

export default VerifyOTPOtp;
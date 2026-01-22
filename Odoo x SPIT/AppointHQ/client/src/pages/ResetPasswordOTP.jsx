import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2, AlertCircle, CheckCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

const ResetPasswordOTP = () => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setPasswordErrors([]);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await axios.post(`${API_URL}/api/otp/reset-password`, {
        email,
        otp,
        newPassword: password
      });

      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setPasswordErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Password reset failed');
      }
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">Redirecting to login page...</p>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-200 border-t-4 border-t-blue-600">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reset Password
            </h2>
            <p className="text-gray-600">
              Enter the OTP and your new password
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
            
            {passwordErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-600 p-3 mb-4 rounded-md text-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Password Requirements:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {passwordErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.
              </p>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white rounded-md py-2 font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Reset Password'}
            </button>
          </motion.form>

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

export default ResetPasswordOTP;
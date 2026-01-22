import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserCircle2, Phone, Calendar, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

const SignupOTP = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPasswordErrors([]);
    
    try {
      const { data } = await axios.post(`${API_URL}/api/otp/signup`, {
        name,
        email,
        mobile,
        password,
        role,
        category: role === 'organiser' ? category : null
      });
      
      // Navigate to OTP verification page
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      if (err.response?.data?.errors) {
        setPasswordErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <Calendar className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AppointHQ
              </span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-card border border-border rounded-lg shadow-lg p-8">
            <div className="space-y-2 text-center mb-6">
              <h2 className="text-3xl font-bold text-card-foreground">Create an account</h2>
              <p className="text-muted-foreground">Enter your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}

              {passwordErrors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 h-11 w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="1234567890"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="pl-10 h-11 w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-11 w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Account Type</label>
                <div className="relative">
                  <UserCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="pl-10 h-11 w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors text-foreground appearance-none cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="organiser">Organiser</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupOTP;
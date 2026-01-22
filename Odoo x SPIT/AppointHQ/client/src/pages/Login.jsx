import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Calendar } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.userId) {
        navigate('/verify-otp', { state: { userId: err.userId, email } });
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password-otp');
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
              <h2 className="text-3xl font-bold text-card-foreground">Welcome back</h2>
              <p className="text-muted-foreground">Enter your credentials to access your account</p>
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
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
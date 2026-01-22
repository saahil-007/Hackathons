import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import VerifyOTP from './pages/VerifyOTP';
import VerifyOTPOtp from './pages/VerifyOTPOtp';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import Profile from './pages/Profile';
import SignupOTP from './pages/SignupOTP';
import ForgotPasswordOTP from './pages/ForgotPasswordOTP';
import ResetPasswordOTP from './pages/ResetPasswordOTP';
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/verify-otp-otp" element={<VerifyOTPOtp />} />
                <Route path="/signup-otp" element={<SignupOTP />} />
                <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
                <Route path="/reset-password-otp" element={<ResetPasswordOTP />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/book/:id" element={
                  <PrivateRoute>
                    <Booking />
                  </PrivateRoute>
                } />
                <Route path="/confirmation/:id" element={
                  <PrivateRoute>
                    <Confirmation />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

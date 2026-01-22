import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Generate a 6-digit numeric OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate password strength
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return errors;
};
// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const subject = 'Your OTP for Account Verification';
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Email Verification</h2>
      <p>Hello,</p>
      <p>Your OTP for account verification is:</p>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; color: #333; border-radius: 5px;">
        ${otp}
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The Team</p>
    </div>
  `;

  try {
    const result = await sendEmail({
      email,
      subject,
      message,
      html: message
    });
    console.log('OTP email sent successfully to:', email);
    return result;
  } catch (error) {
    console.error('Failed to send OTP email to:', email, 'Error:', error);
    throw error;
  }
};// @desc    Register user with OTP
// @route   POST /api/otp/signup
// @access  Public
export const signup = async (req, res) => {
  const { name, email, mobile, password, role, category } = req.body;

  try {
    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Password does not meet requirements', 
        errors: passwordErrors 
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Restrict Admin Registration
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is restricted' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role: role || 'customer',
      category: role === 'organiser' ? category : undefined,
      otp,
      otpExpires
    });

    // Send OTP email with better error handling
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      // If email fails, delete the user to prevent orphaned accounts
      await User.findByIdAndDelete(user._id);
      throw new Error(`Failed to send OTP email: ${emailError.message}`);
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email for OTP.',
      userId: user._id,
      email: user.email
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};// @desc    Verify OTP
// @route   POST /api/otp/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is correct and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Update user verification status and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// @desc    Forgot password - send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email with better error handling
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      // Clear OTP fields if email fails
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      throw new Error(`Failed to send OTP email: ${emailError.message}`);
    }

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/otp/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is correct and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Validate password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Password does not meet requirements', 
        errors: passwordErrors 
      });
    }

    // Update password and clear OTP
    user.password = newPassword; // Will be hashed by pre-save hook
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
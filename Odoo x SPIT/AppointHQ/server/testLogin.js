import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const testLogin = async () => {
  try {
    await connectDB();
    
    // Test login with admin credentials
    const email = 'admin@example.com';
    const password = 'admin123';
    
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      console.log('Login successful!');
      console.log('User:', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      console.log('Login failed!');
      console.log('User found:', !!user);
      if (user) {
        console.log('Password match:', await user.matchPassword(password));
      }
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

testLogin();
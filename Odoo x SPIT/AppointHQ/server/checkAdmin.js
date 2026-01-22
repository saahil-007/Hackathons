import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin exists
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (adminUser) {
      console.log('Admin user found:');
      console.log('- Email:', adminUser.email);
      console.log('- Role:', adminUser.role);
      console.log('- Is Verified:', adminUser.isVerified);
      console.log('- Password (hashed):', adminUser.password);
    } else {
      console.log('Admin user not found');
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

checkAdmin();
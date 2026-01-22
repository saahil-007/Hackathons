import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';
import { API_URL } from '../config';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${API_URL}/api/auth/profile`, { name, email }, config);
      setMessage('Profile updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setMessage('');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${API_URL}/api/auth/password`, { currentPassword, newPassword }, config);
      setMessage('Password updated successfully');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Management</h1>

      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
          <div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Update Profile</button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// Test API connectivity
import axios from 'axios';
import { API_URL } from './config';

console.log('API_URL:', API_URL);

// Test basic connectivity
axios.get(`${API_URL}/`)
  .then(response => {
    console.log('Server reachable:', response.data);
  })
  .catch(error => {
    console.error('Server not reachable:', error.message);
  });

// Test login endpoint specifically
const testLogin = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
};

testLogin();
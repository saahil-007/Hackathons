import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  Users,
  Calendar,
  Activity,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

/* ---------- Static Chart Data ---------- */
const data = [
  { name: 'Mon', bookings: 4, revenue: 240 },
  { name: 'Tue', bookings: 3, revenue: 139 },
  { name: 'Wed', bookings: 2, revenue: 980 },
  { name: 'Thu', bookings: 2, revenue: 390 },
  { name: 'Fri', bookings: 1, revenue: 480 },
  { name: 'Sat', bookings: 2, revenue: 380 },
  { name: 'Sun', bookings: 3, revenue: 430 }
];

const pieData = [
  { name: 'Consultation', value: 400 },
  { name: 'Therapy', value: 300 },
  { name: 'Massage', value: 300 },
  { name: 'Training', value: 200 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/* ---------- Animations ---------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalServices: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  useEffect(() => {
    if (!config) return;
    fetchStats();
    fetchUsers();
    fetchServices();
    fetchCategories();
  }, []);

  /* ---------- API Calls ---------- */
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/stats`, config);
      setStats(data);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/users`, config);
      setUsers(data);
    } catch (err) {
      console.error('Users error:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/services`, config);
      setServices(data);
    } catch (err) {
      console.error('Services error:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/categories`, config);
      setCategories(data);
    } catch (err) {
      console.error('Categories error:', err);
    }
  };

  /* ---------- Actions ---------- */
  const handleUserStatus = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admin/users/${id}/status`, {}, config);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleServiceStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/services/${id}/status`,
        { status },
        config
      );
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update service');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/categories`, newCategory, config);
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/categories/${id}`, config);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of system performance
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex space-x-1 border-b border-gray-200">
          {['overview', 'users', 'services', 'categories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ---------------- OVERVIEW ---------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: Users },
                { label: 'Bookings', value: stats.totalAppointments, icon: Calendar },
                { label: 'Services', value: stats.totalServices, icon: Activity },
                { label: 'Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign }
              ].map((item, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm border-t-4 border-t-blue-500">
                    <div className="flex flex-row justify-between pb-2 p-6">
                      <h3 className="text-sm text-gray-600">
                        {item.label}
                      </h3>
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="p-6 pt-0">
                      <div className="text-2xl font-bold">{item.value}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- USERS ---------------- */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center border-b border-gray-200 py-3"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  {user.status === 'banned' ? (
                    <span className="text-red-500 text-sm">Banned</span>
                  ) : (
                    <button
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      onClick={() => handleUserStatus(user._id)}
                    >
                      {user.status === 'banned' ? 'Unban' : 'Ban'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- SERVICES ---------------- */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Service Approval</h3>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service._id} className="border border-gray-200 p-4 rounded-lg">
                  <h3 className="font-bold">{service.name}</h3>
                  <p className="text-sm text-gray-600">
                    {service.description}
                  </p>
                  {service.approvalStatus === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        onClick={() =>
                          handleServiceStatus(service._id, 'approved')
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        onClick={() =>
                          handleServiceStatus(service._id, 'rejected')
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- CATEGORIES ---------------- */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <form onSubmit={handleCreateCategory} className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                required
                className="md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, description: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category._id} className="flex justify-between items-center border-b border-gray-200 py-3">
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <button
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import VoiceSearchBar from './VoiceSearchBar';
import ReviewForm from './ReviewForm';
import { QrCode, Calendar, Clock, DollarSign, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

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

const CustomerDashboard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedServiceType, setSelectedServiceType] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Customer');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/api/services`),
          axios.get(`${API_URL}/api/admin/categories`)
        ]);

        const servicesData = Array.isArray(servicesRes.data) ? servicesRes.data : [];
        setServices(servicesData);
        setFilteredServices(servicesData);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);

        // Extract unique providers from services
        const allProviders = [];
        const providerMap = new Map();
        
        servicesData.forEach(service => {
          // Add main provider
          if (service.provider && service.provider._id) {
            if (!providerMap.has(service.provider._id)) {
              providerMap.set(service.provider._id, service.provider);
              allProviders.push(service.provider);
            }
          }
          
          // Add additional providers
          if (service.providers && Array.isArray(service.providers)) {
            service.providers.forEach(provider => {
              if (provider && provider._id) {
                if (!providerMap.has(provider._id)) {
                  providerMap.set(provider._id, provider);
                  allProviders.push(provider);
                }
              }
            });
          }
        });
        
        setProviders(allProviders);

        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        setUserName(userInfo.name || 'Customer');

        if (!userInfo.token) {
          setLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const appointmentsRes = await axios.get(`${API_URL}/api/appointments/my`, config);

        const now = new Date();
        const upcoming = [];
        const past = [];

        (Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []).forEach(appt => {
          if (!appt?.date || !appt?.startTime) return;
          const apptDate = new Date(`${appt.date}T${appt.startTime}`);

          if (apptDate < now || appt.status === 'completed' || appt.status === 'cancelled') {
            past.push(appt);
          } else {
            upcoming.push(appt);
          }
        });

        setAppointments(upcoming);
        setPastAppointments(past);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...services];

    if (selectedCategory !== 'All') {
      result = result.filter(service => service?.category?._id === selectedCategory);
    }

    if (selectedServiceType !== 'All') {
      // More robust filtering that handles undefined/null type values
      result = result.filter(service => {
        const serviceType = service?.type || 'user'; // Default to 'user' if type is not set
        return serviceType.toLowerCase() === selectedServiceType.toLowerCase();
      });
    }

    if (selectedProvider !== 'All') {
      result = result.filter(service => {
        // Check if the main provider matches
        if (service?.provider?._id === selectedProvider) return true;
        
        // Check if any of the additional providers match
        if (service?.providers && service.providers.some(provider => provider?._id === selectedProvider)) {
          return true;
        }
        
        return false;
      });
    }

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(service =>
        service?.name?.toLowerCase().includes(lower) ||
        service?.description?.toLowerCase().includes(lower) ||
        service?.provider?.name?.toLowerCase().includes(lower) ||
        (service?.providers && service.providers.some(provider => provider?.name?.toLowerCase().includes(lower)))
      );
    }

    setFilteredServices(result);
  }, [services, selectedCategory, selectedServiceType, selectedProvider, searchQuery]);

  const handleSearch = query => setSearchQuery(query);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Customer Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {userName}
        </p>
      </div>

      {/* Services */}
      <motion.section initial="hidden" animate="visible" variants={containerVariants}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <motion.h2 variants={itemVariants} className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <Search className="h-6 w-6 text-primary" /> Available Services
          </motion.h2>
          <VoiceSearchBar onSearch={handleSearch} />
        </div>

        {/* Service Type */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-4">
          {['All', 'user', 'resource'].map(type => {
            // Count services for each type
            let count = 0;
            if (type === 'All') {
              count = services.length;
            } else {
              count = services.filter(service => {
                const serviceType = service?.type || 'user';
                return serviceType.toLowerCase() === type.toLowerCase();
              }).length;
            }
            
            return (
              <button
                key={type}
                onClick={() => setSelectedServiceType(type)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${selectedServiceType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border hover:bg-accent text-foreground'
                  }`}
              >
                {type === 'All' ? `All Types (${count})` : `${type}-based (${count})`}
              </button>
            );
          })}
        </motion.div>

        {/* Categories */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`rounded-full px-4 py-2 text-sm transition-colors whitespace-nowrap ${selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-accent text-foreground'
              }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors whitespace-nowrap ${selectedCategory === cat._id
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-accent text-foreground'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Providers */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedProvider('All')}
            className={`rounded-full px-4 py-2 text-sm transition-colors whitespace-nowrap ${selectedProvider === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-accent text-foreground'
              }`}
          >
            All Providers
          </button>
          {providers.map(provider => (
            <button
              key={provider._id}
              onClick={() => setSelectedProvider(provider._id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors whitespace-nowrap ${selectedProvider === provider._id
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-accent text-foreground'
                }`}
            >
              {provider.name}
            </button>
          ))}
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <motion.div key={service._id} variants={itemVariants}>
              <div className="bg-card rounded-lg border border-border shadow-sm h-full flex flex-col hover:border-primary/50 transition-colors">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-card-foreground">{service?.name}</h3>
                  {service?.providers && service.providers.length > 0 ? (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Available Providers:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.providers.slice(0, 3).map((provider, idx) => (
                          <span key={provider._id} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                            {provider?.name || 'Unknown'}
                          </span>
                        ))}
                        {service.providers.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{service.providers.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      by {service?.provider?.name || 'Unknown'}
                    </p>
                  )}
                </div>

                <div className="p-6 flex-grow space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {service?.description || 'No description available'}
                  </p>

                  <div className="flex justify-between text-sm text-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {service?.duration || 0} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ₹{service?.price || 0}
                    </span>
                  </div>
                </div>

                <div className="p-6 border-t border-border">
                  <Link to={`/book/${service._id}`} className="w-full">
                    <button className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90 transition-colors">
                      Book Appointment
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              No services found matching your filters.
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setSelectedServiceType('All');
                setSelectedProvider('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </motion.section>

      {/* Appointments */}
      <motion.section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
          <Calendar className="h-6 w-6 text-primary" /> Upcoming Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-muted-foreground">No upcoming appointments.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map(appt => (
              <div className="bg-card rounded-lg border border-border shadow-sm p-6" key={appt._id}>
                <div className="border-b border-border pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">{appt?.service?.name || 'Service'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(appt.date).toDateString()}
                  </p>
                </div>

                <div className="space-y-2 text-foreground">
                  <div>
                    {appt.startTime} - {appt.endTime}
                  </div>
                  <div>
                    Provider: {appt?.provider?.name || 'N/A'}
                  </div>

                  {appt?.service && (
                    <ReviewForm serviceId={appt.service._id} serviceName={appt.service.name} />
                  )}

                  <Link to={`/appointment/${appt._id}`}>
                    <button className="w-full border border-border rounded-md px-4 py-2 hover:bg-accent transition-colors flex items-center justify-center gap-2 mt-2">
                      <QrCode className="h-4 w-4" />
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default CustomerDashboard;

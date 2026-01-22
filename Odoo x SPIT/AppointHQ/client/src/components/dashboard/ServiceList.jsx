import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Share2, Copy, ExternalLink } from 'lucide-react';
import { API_URL } from '../../config';

const ServiceList = ({ onEdit }) => {
    const [services, setServices] = useState([]);

    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/services/my`, config);
            setServices(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const togglePublish = async (service) => {
        try {
            const updated = { ...service, isPublished: !service.isPublished };
            await axios.put(`${API_URL}/api/services/${service._id}`, updated, config);
            setServices(services.map(s => s._id === service._id ? updated : s));
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    const copyShareLink = (id) => {
        const link = `${window.location.origin}/book/${id}`;
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => (
                <div className="bg-white rounded-lg shadow-md p-4 pl-6 space-y-3 border border-gray-200 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${service.isPublished ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.duration} mins • ₹{service.price}</p>
                        </div>
                        <button onClick={() => onEdit(service)} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                            <Edit className="h-4 w-4" />
                        </button>
                    </div>

                    <p className="text-sm line-clamp-2 text-gray-600">{service.description}</p>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={service.isPublished}
                                    onChange={() => togglePublish(service)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <span className="text-xs text-gray-600">
                                {service.isPublished ? 'Published' : 'Unpublished'}
                            </span>
                        </div>

                        <button className="border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2" onClick={() => copyShareLink(service._id)}>
                            <Share2 className="h-3 w-3" />
                            Share
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceList;

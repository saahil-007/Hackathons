import { useState, useEffect } from 'react';
import { Plus, Minus, Clock, Calendar as CalendarIcon, Check, X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';

// Standardized UI components using Tailwind directly to avoid missing import issues
const Input = ({ className = "", ...props }) => (
    <input className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${className}`} {...props} />
);

const TextArea = ({ className = "", ...props }) => (
    <textarea className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px] ${className}`} {...props} />
);

const Select = ({ children, className = "", ...props }) => (
    <select className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${className}`} {...props}>
        {children}
    </select>
);

const Label = ({ children, className = "", ...props }) => (
    <label className={`block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 ${className}`} {...props}>{children}</label>
);

const Button = ({ children, className = "", variant = "primary", size = "default", type = "button", ...props }) => {
    const baseClass = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
        icon: "h-10 w-10 p-2"
    };
    const sizes = {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        icon: "h-10 w-10"
    };

    return (
        <button className={`${baseClass} ${variants[variant] || variants.primary} ${size === 'icon' ? sizes.icon : sizes.default} ${className}`} type={type} {...props}>
            {children}
        </button>
    );
};

const Switch = ({ checked, onCheckedChange, id }) => (
    <div
        className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
        onClick={() => onCheckedChange(!checked)}
        id={id}
    >
        <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
);

const ServiceForm = ({ serviceToEdit, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        type: 'user',
        resources: [],
        providers: [],
        isPublished: true,
        category: '',
        maxBookingsPerSlot: 1,
        manualConfirmation: false,
        advancePayment: false,
        assignmentType: 'auto',
        date: '',
        questions: [],
        pricing: {
            type: 'fixed',
            basePrice: 0,
            ratePerUnit: 0,
            unitDuration: 15
        },
        availability: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00', isActive: true },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
            { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
            { day: 'Thursday', startTime: '09:00', endTime: '17:00', isActive: true },
            { day: 'Friday', startTime: '09:00', endTime: '17:00', isActive: true },
            { day: 'Saturday', startTime: '10:00', endTime: '14:00', isActive: false },
            { day: 'Sunday', startTime: '10:00', endTime: '14:00', isActive: false },
        ]
    });
    const [providerInput, setProviderInput] = useState('');

    const [resourceInput, setResourceInput] = useState('');
    const [questionInput, setQuestionInput] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${API_URL}/api/admin/categories`, config);
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    };

    useEffect(() => {
        if (serviceToEdit) {
            setFormData({
                ...serviceToEdit,
                category: serviceToEdit.category?._id || serviceToEdit.category || '',
                resources: serviceToEdit.resources || [],
                providers: serviceToEdit.providers || [],
                date: serviceToEdit.date ? new Date(serviceToEdit.date).toISOString().split('T')[0] : '',
                pricing: serviceToEdit.pricing || { type: 'fixed', basePrice: serviceToEdit.price || 0, ratePerUnit: 0, unitDuration: 15 },
                availability: serviceToEdit.availability && serviceToEdit.availability.length > 0
                    ? serviceToEdit.availability
                    : formData.availability
            });
            setResourceInput((serviceToEdit.resources || []).join(', '));
        }
    }, [serviceToEdit]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAvailabilityChange = (index, field, value) => {
        const newAvailability = [...formData.availability];
        newAvailability[index][field] = value;
        setFormData(prev => ({ ...prev, availability: newAvailability }));
    };

    const handleAddQuestion = () => {
        if (questionInput.trim()) {
            setFormData(prev => ({ ...prev, questions: [...prev.questions, questionInput.trim()] }));
            setQuestionInput('');
        }
    };

    const handleRemoveQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const handleAddProvider = () => {
        if (providerInput.trim()) {
            setFormData(prev => ({ ...prev, providers: [...prev.providers, providerInput.trim()] }));
            setProviderInput('');
        }
    };

    const handleRemoveProvider = (index) => {
        setFormData(prev => ({
            ...prev,
            providers: prev.providers.filter((_, i) => i !== index)
        }));
    };

    const handlePricingChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            pricing: { ...prev.pricing, [field]: value }
        }));
    };

    // Auto-calculate total price
    useEffect(() => {
        const { type, basePrice, ratePerUnit, unitDuration } = formData.pricing;
        let total = 0;
        const platformFee = 1;

        if (type === 'fixed') {
            total = Number(basePrice) + platformFee;
        } else {
            const duration = Number(formData.duration) || 0;
            const units = duration / (Number(unitDuration) || 15);
            total = Number(basePrice) + (units * Number(ratePerUnit)) + platformFee;
        }

        total = Math.round(total * 100) / 100;

        if (formData.price !== total) {
            setFormData(prev => ({ ...prev, price: total }));
        }
    }, [formData.pricing, formData.duration]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const payload = {
            ...formData,
            resources: resourceInput.split(',').map(s => s.trim()).filter(s => s),
            providers: formData.providers,
            capacity: formData.maxBookingsPerSlot
        };

        try {
            if (serviceToEdit) {
                await axios.put(`${API_URL}/api/services/${serviceToEdit._id}`, payload, config);
            } else {
                await axios.post(`${API_URL}/api/services`, payload, config);
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to save service');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                <h2 className="text-2xl font-bold dark:text-white">
                    {serviceToEdit ? 'Edit Service' : 'Create New Service'}
                </h2>
                <Button variant="ghost" onClick={onCancel} size="icon">
                    <X className="h-6 w-6" />
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-lg pb-1 border-b dark:text-gray-200">Basic Information</h3>

                    <div className="space-y-2">
                        <Label>Service Name</Label>
                        <Input value={formData.name} onChange={e => handleChange('name', e.target.value)} required placeholder="e.g. Haircut, Tennis Court" />
                    </div>

                    <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Select value={formData.type} onChange={e => handleChange('type', e.target.value)}>
                            <option value="user">User Service (Provider based)</option>
                            <option value="resource">Resource (Room, Equipment)</option>
                        </Select>
                        <p className="text-xs text-gray-500">
                            Select 'Resource' if you are renting out items like Bats, Balls, or Courts.
                        </p>
                    </div>

                    {formData.type === 'resource' && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-md space-y-2">
                            <Label className="text-blue-800 dark:text-blue-300">Included Resources</Label>
                            <Input
                                value={resourceInput}
                                onChange={e => setResourceInput(e.target.value)}
                                placeholder="e.g. Bat, Ball, Tennis Racket"
                                className="bg-white dark:bg-gray-800"
                            />
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Enter the items included in this service, separated by commas.
                            </p>
                        </div>
                    )}

                    {/* Provider Section */}
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-md space-y-2">
                        <Label className="text-green-800 dark:text-green-300">Service Providers</Label>
                        <div className="flex gap-2">
                            <Input
                                value={providerInput}
                                onChange={e => setProviderInput(e.target.value)}
                                placeholder="Enter provider name"
                                className="bg-white dark:bg-gray-800 flex-grow"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProvider())}
                            />
                            <Button type="button" onClick={handleAddProvider} className="bg-green-600 hover:bg-green-700">
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.providers.map((provider, index) => (
                                <div key={index} className="flex items-center bg-green-100 dark:bg-green-800/50 rounded-full px-3 py-1 text-sm">
                                    <span>{provider}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveProvider(index)}
                                        className="ml-2 text-green-800 dark:text-green-200 hover:text-green-900"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400">
                            Add multiple providers who can offer this service.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={formData.category} onChange={e => handleChange('category', e.target.value)} required>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <TextArea value={formData.description} onChange={e => handleChange('description', e.target.value)} placeholder="Describe the service..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Duration (min)</Label>
                            <Input type="number" value={formData.duration} onChange={e => handleChange('duration', e.target.value)} min="5" />
                        </div>
                        <div className="space-y-2">
                            <Label>Max Bookings/Slot</Label>
                            <Input type="number" value={formData.maxBookingsPerSlot} onChange={e => handleChange('maxBookingsPerSlot', e.target.value)} min="1" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Rules */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-lg pb-1 border-b dark:text-gray-200">Pricing & Rules</h3>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 space-y-4">
                        <h4 className="font-medium text-sm dark:text-gray-300">Pricing Configuration</h4>

                        <div className="space-y-2">
                            <Label>Model</Label>
                            <Select value={formData.pricing.type} onChange={e => handlePricingChange('type', e.target.value)}>
                                <option value="fixed">Fixed Price</option>
                                <option value="dynamic">Time-Based (Dynamic)</option>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Base Fee (₹)</Label>
                                <Input type="number" value={formData.pricing.basePrice} onChange={e => handlePricingChange('basePrice', e.target.value)} min="0" />
                            </div>
                            {formData.pricing.type === 'dynamic' && (
                                <div className="space-y-2">
                                    <Label>Rate per Unit (₹)</Label>
                                    <Input type="number" value={formData.pricing.ratePerUnit} onChange={e => handlePricingChange('ratePerUnit', e.target.value)} min="0" />
                                </div>
                            )}
                        </div>

                        {formData.pricing.type === 'dynamic' && (
                            <div className="space-y-2">
                                <Label>Billing Unit (mins)</Label>
                                <Select value={formData.pricing.unitDuration} onChange={e => handlePricingChange('unitDuration', Number(e.target.value))}>
                                    <option value="10">10 Minutes</option>
                                    <option value="15">15 Minutes</option>
                                    <option value="30">30 Minutes</option>
                                    <option value="60">1 Hour</option>
                                </Select>
                            </div>
                        )}

                        <div className="bg-white dark:bg-gray-900 p-3 rounded text-sm space-y-1 border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between dark:text-gray-300"><span>Base:</span><span>₹{Number(formData.pricing.basePrice).toFixed(2)}</span></div>
                            <div className="flex justify-between text-muted-foreground dark:text-gray-500"><span>Platform Fee:</span><span>₹1.00</span></div>
                            <div className="flex justify-between font-bold border-t pt-1 mt-1 dark:text-white border-gray-200 dark:border-gray-700">
                                <span>Total Display Price:</span><span>₹{formData.price}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center space-x-3">
                            <Switch
                                id="published"
                                checked={formData.isPublished}
                                onCheckedChange={c => handleChange('isPublished', c)}
                            />
                            <Label htmlFor="published" className="mb-0 cursor-pointer">Publish Service (Public)</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Switch
                                id="manual"
                                checked={formData.manualConfirmation}
                                onCheckedChange={c => handleChange('manualConfirmation', c)}
                            />
                            <Label htmlFor="manual" className="mb-0 cursor-pointer">Requires Manual Confirmation</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Switch
                                id="advance"
                                checked={formData.advancePayment}
                                onCheckedChange={c => handleChange('advancePayment', c)}
                            />
                            <Label htmlFor="advance" className="mb-0 cursor-pointer">Requires Advance Payment</Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3 className="font-semibold text-lg mb-4 dark:text-gray-200">Availability Schedule</h3>
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    {formData.availability.map((slot, index) => (
                        <div key={slot.day} className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800/50">
                            <div className="w-24 font-medium dark:text-gray-300">{slot.day}</div>
                            <Switch
                                checked={slot.isActive}
                                onCheckedChange={c => handleAvailabilityChange(index, 'isActive', c)}
                            />
                            {slot.isActive ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <Input
                                        type="time"
                                        value={slot.startTime}
                                        onChange={e => handleAvailabilityChange(index, 'startTime', e.target.value)}
                                        className="max-w-[130px]"
                                    />
                                    <span className="text-sm text-gray-500">to</span>
                                    <Input
                                        type="time"
                                        value={slot.endTime}
                                        onChange={e => handleAvailabilityChange(index, 'endTime', e.target.value)}
                                        className="max-w-[130px]"
                                    />
                                </div>
                            ) : (
                                <div className="text-gray-400 text-sm flex-1 italic">Unavailable</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-neutral-900 p-4 -mx-6 -mb-6 rounded-b-lg">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Service</Button>
            </div>
        </form>
    );
};

export default ServiceForm;

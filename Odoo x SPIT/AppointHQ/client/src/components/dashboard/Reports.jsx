import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { API_URL } from '../../config';

const Reports = () => {
    const [appointments, setAppointments] = useState([]);
    const [metrics, setMetrics] = useState({
        total: 0,
        revenue: 0,
        completionRate: 0,
        peakHour: 'N/A'
    });
    const [chartData, setChartData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/appointments/provider`, config);
            const data = res.data;
            setAppointments(data);
            calculateMetrics(data);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateMetrics = (data) => {
        // 1. Total Appointments
        const total = data.length;

        // 2. Revenue (Assuming confirmed/completed are paid)
        // Note: service might be populated or just ID depending on endpoint, checking my previous work it is populated
        const revenue = data.reduce((sum, apt) => {
            if (['confirmed', 'completed'].includes(apt.status) && apt.service?.price) {
                return sum + apt.service.price;
            }
            return sum;
        }, 0);

        // 3. Completion Rate
        const completed = data.filter(a => a.status === 'completed').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // 4. Peak Hour
        const hourCounts = {};
        data.forEach(apt => {
            const hour = apt.startTime.split(':')[0]; // "09:00" -> "09"
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        let peakHour = 'N/A';
        let maxCount = 0;
        Object.entries(hourCounts).forEach(([hour, count]) => {
            if (count > maxCount) {
                maxCount = count;
                peakHour = `${hour}:00`;
            }
        });

        setMetrics({ total, revenue, completionRate, peakHour });

        // 5. Chart Data (Bookings by Day of Week)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayCounts = Array(7).fill(0);

        data.forEach(apt => {
            const date = new Date(apt.date);
            const dayIndex = date.getDay();
            dayCounts[dayIndex]++;
        });

        const chart = days.map((day, i) => ({
            name: day,
            bookings: dayCounts[i]
        }));
        setChartData(chart);

        // 6. Status Distribution
        const statusCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
        data.forEach(apt => {
            if (statusCounts[apt.status] !== undefined) {
                statusCounts[apt.status]++;
            }
        });

        setStatusData([
            { name: 'Pending', value: statusCounts.pending, color: '#facc15' }, // yellow-400
            { name: 'Confirmed', value: statusCounts.confirmed, color: '#4ade80' }, // green-400
            { name: 'Completed', value: statusCounts.completed, color: '#60a5fa' }, // blue-400
            { name: 'Cancelled', value: statusCounts.cancelled, color: '#f87171' }, // red-400
        ]);
    };

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.total}</div>
                        <p className="text-xs text-muted-foreground">All time bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{metrics.revenue}</div>
                        <p className="text-xs text-muted-foreground">From confirmed bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.completionRate}%</div>
                        <p className="text-xs text-muted-foreground">Successfully completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Peak Booking Hour</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.peakHour}</div>
                        <p className="text-xs text-muted-foreground">Most popular time</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Bookings by Day of Week</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="bookings" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Booking Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-4">
                            {statusData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    {entry.name} ({entry.value})
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Reports;

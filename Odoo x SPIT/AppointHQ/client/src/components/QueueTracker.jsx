import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

const QueueTracker = ({ appointmentId }) => {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQueueStatus = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      if (!token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const { data } = await axios.get(
        `${API_URL}/api/appointments/${appointmentId}/queue`,
        config
      );
      setQueueStatus(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to track queue');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueStatus();
    // Poll every 1 minute
    const interval = setInterval(fetchQueueStatus, 60000);
    return () => clearInterval(interval);
  }, [appointmentId]);

  if (loading) return <div className="animate-pulse h-20 bg-gray-100 rounded-lg"></div>;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;
  if (!queueStatus) return null;

  const { peopleAhead, estimatedWaitTime, status } = queueStatus;

  // Determine color based on wait time
  let timeColor = "text-green-600";
  if (estimatedWaitTime < 15) timeColor = "text-red-600";
  else if (estimatedWaitTime < 60) timeColor = "text-yellow-600";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Live Queue Tracking
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500 mb-1">People Ahead</span>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">{peopleAhead}</span>
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500 mb-1">Est. Wait Time</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${timeColor}`}>
              {estimatedWaitTime > 0 ? `${estimatedWaitTime} min` : 'Now'}
            </span>
          </div>
          {estimatedWaitTime < 0 && (
            <span className="text-xs text-red-500 mt-1">Running late</span>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Updates automatically every minute
      </div>
    </div>
  );
};

export default QueueTracker;

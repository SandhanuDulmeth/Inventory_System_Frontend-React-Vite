import React, { useEffect, useState } from 'react';
import RadarChartItemTop5 from '../components/radarChartItemTop5';
import './home.css';

const StatsCard = ({ title, value, icon, bgColor, trend }) => {
  return (
    <div className="p-4 rounded-xl bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-neutral-content mb-1">{title}</p>
          <p className="text-2xl font-bold text-base-content mb-2">{value}</p>
          {trend && (
            <span className={`text-sm ${trend.color} flex items-center gap-1`}>
              {trend.icon} {trend.value}
            </span>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [statusMessage, setStatusMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/business/status')
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.text();
        })
        .then(data => {
          setStatusMessage(data);
          setIsLoading(false);
        })
        .catch(() => {
          setStatusMessage("Business insights unavailable at this time");
          setIsLoading(false);
        });
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-base-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-base-content">Inventory Dashboard</h1>
        <div className="badge badge-accent badge-lg">Live Updates</div>
      </div>

      {/* Enhanced Business Insights Section */}
      <div className={`mb-6 p-4 rounded-xl transition-all duration-500 ${
        isLoading ? 'bg-gradient-to-r from-info/20 to-primary/20 animate-pulse' : 
        statusMessage?.includes('unavailable') ? 'bg-error/20 border-l-4 border-error' : 
        'bg-gradient-to-r from-info/20 to-success/20 border-l-4 border-info'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`${isLoading ? 'opacity-50' : ''}`}>
            {isLoading ? (
              <div className="flex items-center gap-3">
                <span className="loading loading-spinner text-info"></span>
                <span className="text-lg text-base-content">Analyzing inventory patterns...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">📈</span>
                  <span className="text-sm font-semibold text-info">AI-Powered Insights</span>
                  <span className="badge badge-sm badge-outline">Mistral 7B</span>
                </div>
                <p className="text-lg font-medium text-base-content">
                  {statusMessage || "No insights available at this moment"}
                </p>
              </>
            )}
          </div>
          {!isLoading && !statusMessage?.includes('unavailable') && (
            <button 
              className="ml-auto btn btn-sm btn-ghost"
              onClick={() => window.location.reload()}
            >
              Refresh Insights
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Items"
          value="1,234"
          icon={<span className="text-primary text-xl">📦</span>}
          bgColor="bg-primary/20"
          trend={{ value: '+12%', color: 'text-success', icon: '↑' }}
        />
        <StatsCard
          title="Low Stock"
          value="27"
          icon={<span className="text-secondary text-xl">⚠️</span>}
          bgColor="bg-secondary/20"
          trend={{ value: '-3%', color: 'text-error', icon: '↓' }}
        />
        <StatsCard
          title="Total Value"
          value="$54,321"
          icon={<span className="text-accent text-xl">💰</span>}
          bgColor="bg-accent/20"
          trend={{ value: '+8.2%', color: 'text-success', icon: '↑' }}
        />
        <StatsCard
          title="Categories"
          value="15"
          icon={<span className="text-neutral text-xl">🗂️</span>}
          bgColor="bg-neutral/20"
          trend={{ value: '+2', color: 'text-success', icon: '→' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-base-content">Inventory Trends</h2>
            <select className="select select-sm select-ghost">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 24 Hours</option>
            </select>
          </div>
          <div className="h-64 bg-gradient-to-br from-primary/5 to-info/5 rounded-lg p-2">
            <RadarChartItemTop5 />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-base-content">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full p-3 btn btn-primary gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Item
            </button>
            <button className="w-full p-3 btn btn-secondary gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Generate Report
            </button>
            <button className="w-full p-3 btn btn-accent gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Manage Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
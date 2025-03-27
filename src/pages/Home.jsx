import React from 'react';
import RadarChartItemTop5 from '../components/radarChartItemTop5';
import './home.css';

const StatsCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="p-4 rounded-xl bg-base-200 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-neutral-content">{title}</p>
          <p className="text-2xl font-bold text-base-content">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="p-6 min-h-screen bg-base-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-base-content">Inventory Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Items"
          value="1,234"
          icon={<span className="text-primary text-xl">📦</span>}
          bgColor="bg-primary/20"
        />
        <StatsCard
          title="Low Stock"
          value="27"
          icon={<span className="text-secondary text-xl">⚠️</span>}
          bgColor="bg-secondary/20"
        />
        <StatsCard
          title="Total Value"
          value="$54,321"
          icon={<span className="text-accent text-xl">💰</span>}
          bgColor="bg-accent/20"
        />
        <StatsCard
          title="Categories"
          value="15"
          icon={<span className="text-neutral text-xl">🗂️</span>}
          bgColor="bg-neutral/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-base-200 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-base-content">Inventory Trends</h2>
          <div className="h-64">
            <RadarChartItemTop5 />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-base-200 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-base-content">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full p-3 btn btn-primary">
              Add New Item
            </button>
            <button className="w-full p-3 btn btn-secondary">
              Generate Report
            </button>
            <button className="w-full p-3 btn btn-accent">
              Manage Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
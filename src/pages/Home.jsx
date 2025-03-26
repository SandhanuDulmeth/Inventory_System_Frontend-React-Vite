import React from 'react'
import SwitchButton from '../components/SwitchButton'
import RadarChartItemTop5 from '../components/radarChartItemTop5'
import './home.css'

const StatsCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className={`p-4 rounded-xl bg-white shadow-lg`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
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
        <div className="p-6 min-h-screen bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
                <SwitchButton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatsCard 
                    title="Total Items" 
                    value="1,234" 
                    icon={<span className="text-blue-500 text-xl">📦</span>}
                    bgColor="bg-blue-100"
                />
                <StatsCard 
                    title="Low Stock" 
                    value="27" 
                    icon={<span className="text-red-500 text-xl">⚠️</span>}
                    bgColor="bg-red-100"
                />
                <StatsCard 
                    title="Total Value" 
                    value="$54,321" 
                    icon={<span className="text-green-500 text-xl">💰</span>}
                    bgColor="bg-green-100"
                />
                <StatsCard 
                    title="Categories" 
                    value="15" 
                    icon={<span className="text-purple-500 text-xl">🗂️</span>}
                    bgColor="bg-purple-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-xl bg-white shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">
                        Inventory Trends
                    </h2>
                    <div className="h-64">
                        <RadarChartItemTop5 />
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-white shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">
                        Quick Actions
                    </h2>
                    <div className="space-y-4">
                        <button className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                            Add New Item
                        </button>
                        <button className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            Generate Report
                        </button>
                        <button className="w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
                            Manage Categories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

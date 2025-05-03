import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Orders = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen p-6">
      <div className={`rounded-xl shadow-lg p-6 h-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Orders</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Create New Order
          </button>
        </div>
        <div className={`border rounded-lg p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Orders will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;
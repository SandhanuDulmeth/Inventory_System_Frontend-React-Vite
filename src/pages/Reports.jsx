import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Reports = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`border rounded-lg p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Inventory Report</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>View inventory status and stock levels</p>
            </div>
            <div className={`border rounded-lg p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Sales Report</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Analyze sales performance</p>
            </div>
            <div className={`border rounded-lg p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Supplier Report</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Review supplier performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const InventoryManagement = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Inventory Management</h1>
      <div className={`rounded-lg shadow p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Current Inventory</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Add New Item
            </button>
          </div>
          <div className={`border rounded-lg p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Inventory items will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement; 
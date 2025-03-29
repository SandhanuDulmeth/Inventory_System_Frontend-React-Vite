import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const InventoryManagementShowItems = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('https://api.example.com/items');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-800/20 text-red-200' : 'bg-red-100 text-red-700'}`}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Inventory Items
          </h1>
          <span className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            Total: {items.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                {['ID', 'Name', 'Description', 'Price', 'Stock', 'Category'].map((header) => (
                  <th
                    key={header}
                    className={`px-6 py-3 text-left text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}
                >
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    #{item.id}
                  </td>
                  <td className={`px-6 py-4 font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {item.name}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.stock_quantity > 10
                          ? isDark
                            ? 'bg-green-800/30 text-green-400'
                            : 'bg-green-100 text-green-800'
                          : isDark
                          ? 'bg-red-800/30 text-red-400'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.stock_quantity} in stock
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && !loading && (
          <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No items found in inventory
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagementShowItems;
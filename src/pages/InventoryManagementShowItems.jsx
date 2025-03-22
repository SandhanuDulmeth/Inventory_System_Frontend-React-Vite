import React from 'react';
import { useTheme } from '../context/ThemeContext';

const InventoryManagementShowItems = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Sample data for items
  const items = [
    { id: 1, name: 'Item 1', quantity: 10, price: 100 },
    { id: 2, name: 'Item 2', quantity: 5, price: 200 },
    { id: 3, name: 'Item 3', quantity: 8, price: 150 },
  ];

  return (
    <div style={{ background: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }}>
      <h1>Inventory Items</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid', padding: '8px' }}>Quantity</th>
            <th style={{ border: '1px solid', padding: '8px' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ border: '1px solid', padding: '8px' }}>{item.id}</td>
              <td style={{ border: '1px solid', padding: '8px' }}>{item.name}</td>
              <td style={{ border: '1px solid', padding: '8px' }}>{item.quantity}</td>
              <td style={{ border: '1px solid', padding: '8px' }}>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagementShowItems;
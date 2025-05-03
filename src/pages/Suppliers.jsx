import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

// Supplier model (can be in a separate file)
class Supplier {
  constructor(id, name, contactPerson, email, phone, address, productsSupplied, status, dateAdded) {
    this.id = id;
    this.name = name;
    this.contactPerson = contactPerson;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.productsSupplied = productsSupplied; // Array of product IDs
    this.status = status; // 'Active' or 'Inactive'
    this.dateAdded = dateAdded;
  }
}

const SupplierTable = ({ suppliers, isDark }) => {
  const statusColors = {
    Active: isDark ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800',
    Inactive: isDark ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'
  };

  return (
    <div className="overflow-x-auto rounded-lg border shadow-sm">
      <table className="w-full">
        <thead className={clsx(isDark ? 'bg-gray-800' : 'bg-gray-50', 'text-left')}>
          <tr>
            {['Name', 'Contact', 'Email', 'Phone', 'Products Supplied', 'Status', 'Added Date'].map((header) => (
              <th
                key={header}
                className={clsx(
                  'px-6 py-3 text-sm font-medium',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className={clsx(
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-700',
                'transition-colors duration-200'
              )}
            >
              <td className="px-6 py-4 text-sm">{supplier.name}</td>
              <td className="px-6 py-4 text-sm">{supplier.contactPerson}</td>
              <td className="px-6 py-4 text-sm">{supplier.email}</td>
              <td className="px-6 py-4 text-sm">{supplier.phone}</td>
              <td className="px-6 py-4 text-sm">{supplier.productsSupplied.join(', ')}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[supplier.status]}`}>
                  {supplier.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">{new Date(supplier.dateAdded).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddSupplierForm = ({ onCancel, isDark }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    productsSupplied: [],
    status: 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className={clsx(
      'rounded-lg border p-6 shadow-sm',
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    )}>
      <h3 className={clsx('text-lg font-semibold mb-6', isDark ? 'text-gray-200' : 'text-gray-800')}>
        New Supplier Information
      </h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Supplier Name', name: 'name', type: 'text' },
          { label: 'Contact Person', name: 'contactPerson', type: 'text' },
          { label: 'Email Address', name: 'email', type: 'email' },
          { label: 'Phone Number', name: 'phone', type: 'tel' },
          { label: 'Address', name: 'address', type: 'text' },
        ].map((field) => (
          <div key={field.name}>
            <label className={clsx('block text-sm font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              className={clsx(
                'w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none',
                isDark 
                  ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              )}
              required
            />
          </div>
        ))}

        <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Supplier
          </button>
        </div>
      </form>
    </div>
  );
};

const Suppliers = () => {
  const { theme } = useTheme();
  const [isAdding, setIsAdding] = useState(false);
  const isDark = theme === 'dark';

  // Sample data
  const suppliers = [
    new Supplier(
      1,
      'Tech Supplies Co.',
      'John Doe',
      'john@techsupplies.co',
      '+1 555-1234',
      '123 Tech Street, Silicon Valley',
      [1, 2, 3],
      'Active',
      '2023-01-15'
    )
  ];

  return (
    <div className="min-h-screen p-6">
      <div className={`rounded-xl shadow-lg p-6 h-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className={clsx('text-2xl font-bold', isDark ? 'text-gray-100' : 'text-gray-900')}>
              Supplier Management
            </h1>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isAdding ? 'View Suppliers' : 'Add New Supplier'}
            </button>
          </div>

          {isAdding ? (
            <AddSupplierForm onCancel={() => setIsAdding(false)} isDark={isDark} />
          ) : (
            <SupplierTable suppliers={suppliers} isDark={isDark} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
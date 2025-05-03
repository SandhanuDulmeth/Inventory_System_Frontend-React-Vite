import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { FiEdit, FiTrash2, FiX, FiPlus } from 'react-icons/fi';

class Supplier {
  constructor(id, name, contactPerson, email, phone, address, productsSupplied, status, dateAdded) {
    this.id = id;
    this.name = name;
    this.contactPerson = contactPerson;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.productsSupplied = productsSupplied;
    this.status = status;
    this.dateAdded = dateAdded;
  }
}

const API_ENDPOINT = 'http://localhost:8080/SupplierController';

const SupplierTable = ({ suppliers, isDark, onEdit, onDelete }) => {
  const statusColors = {
    Active: isDark ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800',
    Inactive: isDark ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'
  };

  return (
    <div className="overflow-x-auto rounded-lg border shadow-sm">
      <table className="w-full">
        <thead className={clsx(isDark ? 'bg-gray-800' : 'bg-gray-50', 'text-left')}>
          <tr>
            {['Name', 'Contact', 'Email', 'Phone', 'Products', 'Status', 'Added Date', 'Actions'].map((header) => (
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
                'transition-colors duration-200 cursor-pointer'
              )}
            >
              <td className="px-6 py-4 text-sm">{supplier.name}</td>
              <td className="px-6 py-4 text-sm">{supplier.contactPerson}</td>
              <td className="px-6 py-4 text-sm">{supplier.email}</td>
              <td className="px-6 py-4 text-sm">{supplier.phone}</td>
              <td className="px-6 py-4 text-sm">{supplier.productsSupplied?.join(', ') || ''}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[supplier.status]}`}>
                  {supplier.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                {supplier.dateAdded ? new Date(supplier.dateAdded).toLocaleDateString() : ''}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(supplier); }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(supplier); }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SupplierModal = ({ supplier, isOpen, onClose, isDark, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({ 
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    productsSupplied: [],
    status: 'Active'
  });

  useEffect(() => {
    if (supplier) setFormData({ ...supplier });
  }, [supplier]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      productsSupplied: formData.productsSupplied.split(',').map(p => p.trim())
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={clsx(
        'rounded-lg w-full max-w-2xl',
        isDark ? 'bg-gray-800' : 'bg-white'
      )}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className={clsx('text-xl font-semibold', isDark ? 'text-gray-200' : 'text-gray-800')}>
              {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
            </h3>
            <button
              onClick={onClose}
              className={clsx(
                'p-2 rounded-lg hover:bg-opacity-20',
                isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={clsx('block text-sm font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Supplier Name
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={clsx(
                  'w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none',
                  isDark 
                    ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
              />
            </div>

            <div>
              <label className={clsx('block text-sm font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Contact Person
              </label>
              <input
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className={clsx(
                  'w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none',
                  isDark 
                    ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
              />
            </div>

            <div>
              <label className={clsx('block text-sm font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={clsx(
                  'w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none',
                  isDark 
                    ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
              />
            </div>

            <div>
              <label className={clsx('block text-sm font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Phone
              </label>
              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={clsx(
                  'w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none',
                  isDark 
                    ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label className={clsx('block text-sm font-medium mb-1', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Products Supplied (comma separated)
              </label>
              <input
                value={formData.productsSupplied}
                onChange={(e) => setFormData({ ...formData, productsSupplied: e.target.value })}
                className={clsx(
                  'w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none',
                  isDark 
                    ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {isEditing ? 'Update Supplier' : 'Create Supplier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Suppliers = () => {
  const { theme } = useTheme();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const isDark = theme === 'dark';

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/get-suppliers`);
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const createSupplier = async (newSupplier) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier)
      });
      
      if (response.ok) {
        await fetchSuppliers();
      }
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  const deleteSupplier = async (id) => {
    try {
      // Replace with actual delete endpoint when available
      console.log('Delete functionality not implemented yet');
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-gray-100' : 'text-gray-900')}>
            Supplier Management
          </h1>
          <button
            onClick={() => {
              setSelectedSupplier(new Supplier(
                null, 
                '', 
                '', 
                '', 
                '', 
                '', 
                [], 
                'Active', 
                new Date().toISOString()
              ));
              setIsAdding(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FiPlus size={18} />
            Add New Supplier
          </button>
        </div>

        <SupplierTable
          suppliers={suppliers}
          isDark={isDark}
          onEdit={(supplier) => {
            setSelectedSupplier(supplier);
            setIsEditing(true);
          }}
          onDelete={(supplier) => {
            setSelectedSupplier(supplier);
            setIsDeleting(true);
          }}
        />

        {/* Add/Edit Modal */}
        <SupplierModal
          supplier={selectedSupplier}
          isOpen={isEditing || isAdding}
          onClose={() => {
            setIsEditing(false);
            setIsAdding(false);
          }}
          isDark={isDark}
          onSubmit={isAdding ? createSupplier : () => {}}
          isEditing={isEditing}
        />

        {/* Delete Modal */}
        {isDeleting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={clsx(
              'rounded-lg w-full max-w-md p-6',
              isDark ? 'bg-gray-800' : 'bg-white'
            )}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={clsx('text-xl font-semibold', isDark ? 'text-gray-200' : 'text-gray-800')}>
                  Confirm Delete
                </h3>
                <button
                  onClick={() => setIsDeleting(false)}
                  className={clsx(
                    'p-2 rounded-lg hover:bg-opacity-20',
                    isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <FiX size={24} />
                </button>
              </div>
              <p className={clsx('mb-6', isDark ? 'text-gray-300' : 'text-gray-700')}>
                Are you sure you want to delete {selectedSupplier?.name}?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteSupplier(selectedSupplier.id);
                    setIsDeleting(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
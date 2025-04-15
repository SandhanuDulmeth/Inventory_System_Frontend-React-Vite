import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const InventoryManagementAddItem = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
  });
  const [focusedFields, setFocusedFields] = useState({
    name: false,
    description: false,
    price: false,
    stock_quantity: false,
    category_id: false,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusedFields((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8080/ProductController/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.stock_quantity),
          categoryId: parseInt(formData.category_id),
        }),
      });

      if (!response.ok) throw new Error('Failed to create product');

      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: '',
      });
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className={`rounded-xl shadow-2xl w-full max-w-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          New Product Details
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
              autoFocus
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
            <label
              className={`absolute left-4 transition-all duration-200 ${
                formData.name || focusedFields.name
                  ? '-top-2 text-xs text-blue-500'
                  : `top-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`
              }`}
            >
              Product Name *
            </label>
          </div>

          {/* Description */}
          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              onFocus={() => handleFocus('description')}
              onBlur={() => handleBlur('description')}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows="3"
              required
            />
            <label
              className={`absolute left-4 transition-all duration-200 ${
                formData.description || focusedFields.description
                  ? '-top-2 text-xs text-blue-500'
                  : `top-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`
              }`}
            >
              Description *
            </label>
          </div>

          {/* Price and Stock Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div className="relative">
              <div className="flex items-center">
                <span className={`absolute left-3 bottom-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('price')}
                  onBlur={() => handleBlur('price')}
                  step="0.01"
                  min="0"
                  className={`w-full pl-7 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <label
                className={`absolute left-7 transition-all duration-200 ${
                  formData.price || focusedFields.price
                    ? '-top-2 text-xs text-blue-500'
                    : `top-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`
                }`}
              >
                Price *
              </label>
            </div>

            {/* Stock Quantity */}
            <div className="relative">
              <div className="flex items-center">
                <span className={`absolute left-3 bottom-3.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>#</span>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('stock_quantity')}
                  onBlur={() => handleBlur('stock_quantity')}
                  min="0"
                  className={`w-full pl-7 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <label
                className={`absolute left-7 transition-all duration-200 ${
                  formData.stock_quantity || focusedFields.stock_quantity
                    ? '-top-2 text-xs text-blue-500'
                    : `top-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`
                }`}
              >
                Stock Quantity *
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              onFocus={() => handleFocus('category_id')}
              onBlur={() => handleBlur('category_id')}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            >
              <option value="">Select Category</option>
              <option value="1">Electronics</option>
              <option value="2">Office Supplies</option>
              <option value="3">Furniture</option>
              <option value="4">Appliances</option>
            </select>
            <label
              className={`absolute left-4 transition-all duration-200 ${
                formData.category_id || focusedFields.category_id
                  ? '-top-2 text-xs text-blue-500'
                  : `top-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`
              }`}
            >
              Category *
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryManagementAddItem;
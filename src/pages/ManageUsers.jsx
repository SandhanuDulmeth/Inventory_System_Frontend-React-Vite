import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/admin/customers';

const ManageUsers = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (mode === 'edit' && selectedUser) {
      setShowPassword(false); // Reset visibility when entering edit mode
    }
  }, [mode, selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch users');
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error('Error fetching users:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'add') {
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create user');
        await fetchUsers();
      } else if (mode === 'edit') {
        const updatedCustomer = {
          id: selectedUser.id,
          email: formData.email,
          password: formData.password !== '' ? formData.password : selectedUser.password
        };
        const response = await fetch(`${API_BASE}/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCustomer),
        });
        if (!response.ok) throw new Error('Failed to update user');
        await fetchUsers();
      }
      setMode('list');
      setFormData({ email: '', password: '' });
    } catch (err) {
      setError(err.message);
      console.error('Operation failed:', err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      const result = await response.json();
      if (result) setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {mode === 'list' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Users</h2>
              <button
                onClick={() => setMode('add')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <FiPlus className="mr-2" /> Add User
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold">Email</th>
                    <th className="p-3 text-left text-sm font-semibold">Password</th>
                    <th className="p-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">••••••••</td>
                      <td className="p-3 flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setFormData({ email: user.email, password: '' });
                            setMode('edit');
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={() => setMode('list')}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Back to List
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {mode === 'add' ? 'Add New User' : 'Edit User'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  {mode === 'add' ? 'Password' : 'New Password (leave blank to keep current)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg pr-10"
                    placeholder={mode === 'edit' ? 'Enter new password to change' : ''}
                    required={mode === 'add'}
                  />
                  {formData.password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  )}
                </div>
                {mode === 'edit' && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.password ? 
                      'New password will be updated' : 
                      'Current password will remain unchanged'}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {mode === 'add' ? 'Create User' : 'Update User'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
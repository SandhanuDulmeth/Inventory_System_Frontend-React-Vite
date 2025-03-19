import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For testing purposes, we'll simulate the API response
      // In production, replace this with actual API call
      if (credentials.email === 'admin@admin.com' && credentials.password === 'admin123') {
        const adminData = {
          id: 'admin@admin.com', // Using email as ID for now
          role: 'ADMIN',
          email: 'admin@admin.com',
          token: 'admin-token'
        };
        login(adminData);
        navigate('/admin');
      } else if (credentials.email === 'customer12@gmail.com' && credentials.password === 'customer12') {
        const customerData = {
          id: 'customer12@gmail.com', // Using email as ID for now
          role: 'CUSTOMER',
          email: 'customer12@gmail.com',
          token: 'customer-token'
        };
        login(customerData);
        navigate('/customer');
      } else if (credentials.email === 'customer123@gmail.com' && credentials.password === 'customer123') {
      const customerData = {
        id: 'customer123@gmail.com', // Using email as ID for now
        role: 'CUSTOMER',
        email: 'customer123@gmail.com',
        token: 'customer-token'
      };
      login(customerData);
      navigate('/customer');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    setError('Invalid email or password');
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">Inventory System Login</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign In
        </button>
      </form>

      {/* Test Credentials */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Test Credentials:</h3>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Admin:</span> email: admin@admin.com, password: admin123
          </p>
          <p className="text-sm">
            <span className="font-medium">Customer:</span> email: customer12@gmail.com, password: customer12
          </p>
          <p className="text-sm">
            <span className="font-medium">Customer:</span> email: customer123@gmail.com, password: customer123
          </p>
        </div>
      </div>
    </div>
  </div>
);
};

export default Login; 
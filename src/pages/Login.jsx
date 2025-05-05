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
    setError(''); // Reset error message

    try {
      // Check if email belongs to an admin
      const emailResponse = await fetch(
        `http://localhost:8080/admin/check-email?email=${credentials.email}`
      );
      if (!emailResponse.ok) {
        throw new Error('Failed to check email');
      }
      const isEmailValid = await emailResponse.json();

      if (isEmailValid) {
        // Check admin password
        const passwordResponse = await fetch(
          `http://localhost:8080/admin/check-password?email=${credentials.email}&password=${credentials.password}`
        );
        if (!passwordResponse.ok) {
          throw new Error('Failed to check password');
        }
        const isPasswordValid = await passwordResponse.json();

        if (isPasswordValid) {
          // Admin login successful
          const adminData = {
            id: credentials.email,
            role: 'ADMIN',
            email: credentials.email,
            token: 'admin-token',
          };
          login(adminData);
          navigate('/admin');
          return;
        } else {
          setError('Invalid password');
          return; // Exit after invalid admin password
        }
      }

      // If not admin, check customer credentials
      const customerEmailResponse = await fetch(
        `http://localhost:8080/api/customer/check-email?email=${credentials.email}`
      );
      if (!customerEmailResponse.ok) throw new Error('Failed to check customer email');
      const isCustomerEmailValid = await customerEmailResponse.json();

      if (!isCustomerEmailValid) {
        throw new Error('Customer email not found');
      }

      const customerPasswordResponse = await fetch(
        `http://localhost:8080/api/customer/check-password?email=${credentials.email}&password=${credentials.password}`
      );
      if (!customerPasswordResponse.ok) throw new Error('Failed to check customer password');
      const isCustomerPasswordValid = await customerPasswordResponse.json();

      if (isCustomerPasswordValid) {
        // Get customer ID from backend
        const customerIdResponse = await fetch(
          `http://localhost:8080/api/customer/CustomerIdByEmail?email=${credentials.email}`
        );
        if (!customerIdResponse.ok) throw new Error('Failed to fetch customer ID');
        const customerId = await customerIdResponse.json();

        const customerData = {
          id: customerId, // Use the retrieved ID
          customerId: customerId, // Explicitly set customerId
          role: 'CUSTOMER',
          email: credentials.email,
          token: 'customer-token',
        };
        login(customerData);
        navigate('/customer');
      } else {
        setError('Invalid customer password');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="relative bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-xl w-full max-w-md border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5 rounded-2xl -z-10" />
        
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        
        {error && (
          <div className="bg-red-500/90 text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 text-white placeholder-white/50 transition-all duration-200"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 text-white placeholder-white/50 transition-all duration-200"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-cyan-500/20"
          >
            Sign In
          </button>
        </form>

        {/* Test Credentials */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-sm font-medium text-white/80 mb-3">Test Credentials</h3>
          <div className="space-y-2.5">
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm font-medium text-cyan-400">Admin Account</p>
              <p className="text-xs text-white/70 mt-1">admin@admin.com<br/>admin123</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm font-medium text-cyan-400">Customer Accounts</p>
              <p className="text-xs text-white/70 mt-1">customer12@gmail.com<br/>customer12</p>
              <p className="text-xs text-white/70 mt-1">customer123@gmail.com<br/>customer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
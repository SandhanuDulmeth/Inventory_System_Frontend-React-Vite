import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    // Fetch admin dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Manage Users
            </button>
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Manage Products
            </button>
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
              View Reports
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {/* Add recent activity items here */}
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
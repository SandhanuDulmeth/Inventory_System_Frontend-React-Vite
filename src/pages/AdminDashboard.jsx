import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SlideOutPanel from '../components/SlideOutPanel';
import ManageUsers from '../pages/ManageUsers'; 

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false); // Add this state

  useEffect(() => {
    // Fetch admin dashboard data
    const fetchDashboardData = async () => {
      try {
        //Input the Total Users, Total Orders, and Total Products
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
    <div className="min-h-screen p-6 bg-gray-100">
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
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => setShowManageUsers(true)} // Open modal
            >
              Manage Users
            </button>
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Manage Products
            </button>
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
              View Reports
            </button>
            <button 
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
              onClick={() => setIsChatOpen(true)}
            >
              Open Chat
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

      {/* Manage Users Modal */}
      {showManageUsers && (
        <ManageUsers onClose={() => setShowManageUsers(false)} />
      )}

      {/* Slide-out panel for AdminChat */}
      <SlideOutPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default AdminDashboard;
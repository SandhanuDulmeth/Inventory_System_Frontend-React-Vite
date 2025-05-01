import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axios from 'axios';
import { CountUp } from 'use-count-up';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogarithmicScale } from 'chart.js';

const Analysis = () => {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState({ items: 0, orders: 0, sales: 0 });
  const [categories, setCategories] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) {
      return; // Component will show "Checking authentication..."
    }

    if (!user?.id) {
      return; // Component will show "Please login to view analytics"
    }

    const fetchData = async () => {
      try {
        setError('');
        setDataLoading(true);

        // Use customerId from user if available, otherwise default to 1
        const customerId = user.customerId || 1;
 

        const [itemsRes, categoriesRes, ordersRes] = await Promise.all([
          axios.get(`/api/report/items/count?customerId=${customerId}`),
          axios.get('/api/report/categories'),
          axios.get(`/api/report/orders?customerId=${customerId}`),
        ]);

        const orders = ordersRes.data;
        const monthlySales = processSalesData(orders);

        setMetrics({
          items: itemsRes.data,
          orders: orders.length,
          sales: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        });


        setCategories(categoriesRes.data);
        setSalesData(monthlySales);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const processSalesData = (orders) => {
    const monthlySales = {};

    orders.forEach((order) => {
      const month = new Date(order.orderDate).toLocaleString('default', { month: 'short' });
      if (!monthlySales[month]) {
        monthlySales[month] = { month, sales: 0, orders: 0 };
      }
      monthlySales[month].sales += order.totalAmount;
      monthlySales[month].orders++;
    });

    return Object.values(monthlySales).sort((a, b) =>
      new Date(`2024-${a.month}`) - new Date(`2024-${b.month}`)
    );
  };

  if (authLoading) {
    return <div className="text-center p-8">Checking authentication...</div>;
  }

  if (!user) {
    return <div className="text-center p-8 text-red-500">Please login to view analytics</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (dataLoading) {
    return <div className="text-center p-8">Loading analytics data...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Business Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard label="Total Products" value={metrics.items} prefix="" />
        <MetricCard label="Total Orders" value={metrics.orders} prefix="" />
        <MetricCard label="Total Sales" value={metrics.sales} prefix="$" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" name="Total Sales" fill="#4F46E5" />
                <Bar dataKey="orders" name="Number of Orders" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Inventory Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="productCount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#3B82F6"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, prefix }) => (
  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm">
    <h3 className="text-sm font-medium text-gray-600">{label}</h3>
    <p className="text-3xl font-bold text-gray-900 mt-2">
      {prefix}
      <CountUp isCounting end={value} duration={2} />
    </p>
  </div>
);

export default Analysis;
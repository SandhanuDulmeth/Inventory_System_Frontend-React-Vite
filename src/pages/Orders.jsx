import React from 'react';

const Orders = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Order Management</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Create New Order
            </button>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-gray-600">Orders will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders; 
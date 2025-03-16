import React from 'react';

const Reports = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Inventory Report</h3>
              <p className="text-gray-600">View inventory status and stock levels</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Sales Report</h3>
              <p className="text-gray-600">Analyze sales performance</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Supplier Report</h3>
              <p className="text-gray-600">Review supplier performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 
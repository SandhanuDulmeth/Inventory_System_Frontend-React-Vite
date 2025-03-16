import React from 'react';

const Analysis = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analysis</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Inventory Analysis</h2>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Inventory trends chart will be displayed here</p>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Sales Analysis</h2>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Sales performance chart will be displayed here</p>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold">Total Stock Value</h3>
                <p className="text-2xl font-bold mt-2">$0.00</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold">Monthly Sales</h3>
                <p className="text-2xl font-bold mt-2">$0.00</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold">Stock Turnover</h3>
                <p className="text-2xl font-bold mt-2">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis; 
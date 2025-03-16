import React from 'react';

const HelpSupport = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid gap-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">How do I add new inventory items?</h3>
                <p className="text-gray-600">Navigate to Inventory Management and click on "Add New Item" button...</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">How do I generate reports?</h3>
                <p className="text-gray-600">Go to the Reports section and select the type of report you want to generate...</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <p className="text-gray-600">Need additional help? Contact our support team at support@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport; 
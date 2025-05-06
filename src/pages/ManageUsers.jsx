import React from 'react';

const ManageUsers = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
        {/* User management UI goes here */}
        <div className="text-gray-600">User management functionality coming soon.</div>
      </div>
    </div>
  );
};

export default ManageUsers;
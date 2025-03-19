import React from 'react';
import AdminChat from './AdminChat';

// const SlideOutPanel = ({ isOpen, onClose }) => {
//   return (
//     <div
//       className={`fixed right-0 top-0 h-full w-[70rem] transform ${
//         isOpen ? 'translate-x-0' : 'translate-x-full'
//       } transition-transform duration-300 ease-in-out bg-white shadow-lg flex flex-col`}
//     >
//       <div className="p-4 border-b flex justify-between items-center">
//         <h2 className="text-lg font-semibold">Support Chat</h2>
//         <button onClick={onClose} className="text-red-500 hover:text-red-700">
//           Close
//         </button>
//       </div>
      
//       {/* Chat container with proper height management */}
//       <div className="flex-1 overflow-hidden">
//         <AdminChat />
//       </div>
//     </div>
//   );
// };

// export default SlideOutPanel; 
const SlideOutPanel = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-[70rem] transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out bg-white shadow-lg flex flex-col`}
    >
      {/* Header remains fixed */}
      <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-50">
        <h2 className="text-lg font-semibold">Support Chat</h2>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          Close
        </button>
      </div>
      
      {/* Chat container with proper height management */}
      <div className="flex-1 overflow-hidden">
        <AdminChat />
      </div>
    </div>
  );
};
export default SlideOutPanel; 
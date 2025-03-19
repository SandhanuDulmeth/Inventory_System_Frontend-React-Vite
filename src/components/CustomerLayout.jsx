import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Menu from './Menu';
import Home from '../pages/Home';
import InventoryManagement from '../pages/InventoryManagement';
import Orders from '../pages/Orders';
import Suppliers from '../pages/Suppliers';
import Reports from '../pages/Reports';
import HelpSupport from '../pages/HelpSupport';
import Analysis from '../pages/Analysis';
import { useTheme } from '../context/ThemeContext';

const CustomerLayout = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isHelpSupport = location.pathname === '/customer/help-support';

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
  
      <div className="flex-none">
        <NavBar />
      </div>

 
      <div className="flex-1 flex overflow-hidden">
    
        <div className={`w-64 border-r shadow-sm transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <Menu />
        </div>

        <div className={`flex-1 overflow-auto transition-colors duration-200 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          {isHelpSupport ? (
            <HelpSupport />
          ) : (
            <div className={`p-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              <div className={`rounded-lg shadow-sm p-6 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="suppliers" element={<Suppliers />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="analysis" element={<Analysis />} />
                </Routes>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout; 
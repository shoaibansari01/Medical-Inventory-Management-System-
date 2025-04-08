import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaPills,
  FaBoxes,
  FaShoppingCart,
  FaChartBar,
  FaBell,
  FaSignOutAlt,
  FaHeartbeat,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Sidebar = ({ isMobileOpen, toggleMobileSidebar }) => {
  const { logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { to: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { to: '/medicines', icon: <FaPills />, label: 'Medicines' },
    { to: '/stock', icon: <FaBoxes />, label: 'Stock' },
    { to: '/sales', icon: <FaShoppingCart />, label: 'Sales' },
    { to: '/reports', icon: <FaChartBar />, label: 'Reports' },
    { to: '/alerts', icon: <FaBell />, label: 'Alerts' },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 h-screen shadow-xl flex flex-col fixed md:sticky top-0 z-40 transition-all duration-300 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} w-[85vw] max-w-[300px] md:w-64`}>
      {/* Mobile close button */}
      <div className="md:hidden absolute right-2 top-2">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>

      {/* Logo and branding */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <FaHeartbeat className="text-accent-600 text-2xl mr-2" />
          <h1 className="text-xl font-bold font-display">
            <span className="text-primary-700 dark:text-primary-400">Care</span> <span className="text-accent-600 dark:text-accent-400">India</span>
          </h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-1">Medical Inventory System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 h-full">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 ${
                    isActive ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 shadow-sm' : ''
                  }`
                }
                onMouseEnter={() => setHoveredItem(item.to)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => isMobileOpen && toggleMobileSidebar()}
              >
                <span className={`mr-3 text-lg transition-transform duration-300 ${hoveredItem === item.to ? 'transform scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section and logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Logged in as</p>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Administrator</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-all duration-200 hover:shadow-sm"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

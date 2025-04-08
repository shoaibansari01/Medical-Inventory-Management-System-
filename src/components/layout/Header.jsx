import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaBell, FaUser, FaBars, FaSearch, FaCalendarAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { alertService } from '../../services/storageService';

const Header = ({ toggleMobileSidebar }) => {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('');
  const [alerts, setAlerts] = useState({ lowStock: [], expiringSoon: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Set page title based on current route
  useEffect(() => {
    const path = location.pathname;

    if (path.includes('/dashboard')) {
      setPageTitle('Dashboard');
    } else if (path.includes('/medicines')) {
      setPageTitle('Medicine Management');
    } else if (path.includes('/stock')) {
      setPageTitle('Stock Operations');
    } else if (path.includes('/sales')) {
      setPageTitle('Sales Tracking');
    } else if (path.includes('/reports')) {
      setPageTitle('Reports & Analytics');
    } else if (path.includes('/alerts')) {
      setPageTitle('Alerts');
    } else {
      setPageTitle('Medical Inventory');
    }
  }, [location]);

  // Get alerts
  useEffect(() => {
    const fetchAlerts = () => {
      const allAlerts = alertService.getAllAlerts();
      setAlerts(allAlerts);
    };

    fetchAlerts();

    // Refresh alerts every minute
    const interval = setInterval(fetchAlerts, 60000);

    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Format current time
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  // Total number of alerts
  const totalAlerts = alerts.lowStock.length + alerts.expiringSoon.length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-3 sm:px-4 py-2 sm:py-3 sticky top-0 z-20 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button and page title */}
        <div className="flex items-center">
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 mr-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <FaBars className="text-xl" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white font-display animate-fade-in truncate max-w-[180px] sm:max-w-xs md:max-w-none">{pageTitle}</h1>
            <div className="hidden sm:flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
              <FaCalendarAlt className="mr-1" />
              <span>{formattedDate} | {formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Right side - Search, alerts, theme toggle, user */}
        <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-4">
          {/* Search - visible only on larger screens */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 w-40 lg:w-64 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 dark:text-white dark:placeholder-gray-400 transition-all duration-300"
            />
          </div>

          {/* Alerts */}
          <div className="relative">
            <Link to="/alerts" className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <FaBell className="text-xl" />
              {totalAlerts > 0 && (
                <span className="absolute top-0 right-0 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-slow">
                  {totalAlerts}
                </span>
              )}
            </Link>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-primary-400 rounded-lg transition-all duration-200"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FaSun className="text-xl text-yellow-400" /> : <FaMoon className="text-xl" />}
          </button>

          {/* User profile */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <div className="bg-primary-100 dark:bg-primary-900 rounded-full p-1.5">
                <FaUser className="text-primary-600 dark:text-primary-400" />
              </div>
              <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300 font-medium">
                {currentUser?.username || 'User'}
              </span>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10 animate-slide-down">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.username || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
                <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Add logout functionality here
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

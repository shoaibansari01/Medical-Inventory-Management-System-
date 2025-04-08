import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StockSummary from '../components/dashboard/StockSummary';
import SalesOverview from '../components/dashboard/SalesOverview';
import TopMedicines from '../components/dashboard/TopMedicines';
import { alertService, medicineService, salesService } from '../services/storageService';
import { FaExclamationTriangle, FaArrowRight, FaBoxOpen, FaCalendarAlt, FaHeartbeat } from 'react-icons/fa';
import { formatDate, getDaysUntilExpiry, getCurrentDateISO } from '../utils/dateUtils';

const Dashboard = () => {
  const [alerts, setAlerts] = useState({ lowStock: [], expiringSoon: [] });
  const [loading, setLoading] = useState(true);
  const [medicineCount, setMedicineCount] = useState(0);
  const [newMedicinesCount, setNewMedicinesCount] = useState(0);
  const [salesData, setSalesData] = useState({ totalSales: 0, totalRevenue: 0 });

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      // Get alerts
      const allAlerts = alertService.getAllAlerts();
      setAlerts(allAlerts);

      // Get medicine count
      const medicines = medicineService.getAll();
      setMedicineCount(medicines.length);

      // Calculate new medicines added this month
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const newMedicines = medicines.filter(medicine => {
        const createdDate = new Date(medicine.createdAt);
        return createdDate >= firstDayOfMonth;
      });
      setNewMedicinesCount(newMedicines.length);

      // Get sales data
      const allSales = salesService.getAllSales();
      const totalSales = allSales.reduce((sum, sale) => sum + sale.quantity, 0);
      const totalRevenue = allSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      setSalesData({ totalSales, totalRevenue });

      setLoading(false);
    };

    fetchData();
  }, []);

  // Total number of alerts
  const totalAlerts = alerts.lowStock.length + alerts.expiringSoon.length;

  // Welcome message with time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-xl shadow-lg p-4 sm:p-6 text-white animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display mb-1 sm:mb-2">
              {getGreeting()}, <span className="text-primary-100">Administrator</span>
            </h1>
            <p className="text-primary-100 text-sm sm:text-base mb-3 sm:mb-0">
              Welcome to Care India Medical Inventory Management System
            </p>
          </div>
          <div className="flex space-x-2">
            <Link to="/alerts" className="btn bg-white text-primary-700 hover:bg-primary-50 dark:bg-primary-900 dark:text-white dark:hover:bg-primary-800 flex items-center text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm">
              <FaExclamationTriangle className="mr-1" />
              {totalAlerts > 0 ? `${totalAlerts} Alerts` : 'No Alerts'}
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover p-3 sm:p-4 border-l-4 border-primary-500 dark:border-primary-400 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Medicines</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{medicineCount}</h3>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 sm:p-3 rounded-full">
              <FaBoxOpen className="text-lg sm:text-xl text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
            <span>{newMedicinesCount} added this month</span>
            <Link to="/medicines" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center">
              View All <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover p-3 sm:p-4 border-l-4 border-secondary-500 dark:border-secondary-400 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Sales</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{salesData.totalSales}</h3>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-2 sm:p-3 rounded-full">
              <FaCalendarAlt className="text-lg sm:text-xl text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
            <span>Revenue: ₹{salesData.totalRevenue.toFixed(2)}</span>
            <Link to="/sales" className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 flex items-center">
              View All <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover p-3 sm:p-4 border-l-4 border-accent-500 dark:border-accent-400 transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Alerts</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{totalAlerts}</h3>
            </div>
            <div className="bg-accent-100 dark:bg-accent-900/30 p-2 sm:p-3 rounded-full">
              <FaHeartbeat className="text-lg sm:text-xl text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
            <span>
              <span className="text-red-600 dark:text-red-400 font-medium">{alerts.lowStock.length}</span> low stock,
              <span className="text-amber-600 dark:text-amber-400 font-medium"> {alerts.expiringSoon.length}</span> expiring
            </span>
            <Link to="/alerts" className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 flex items-center">
              View All <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white font-display">Inventory Overview</h2>
            <Link to="/reports" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center">
              View Reports <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>
          <StockSummary />
        </div>

        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white font-display">Top Performers</h2>
            <Link to="/sales" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center">
              View All <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>
          <TopMedicines />
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white font-display">Sales Overview</h2>
          <Link to="/sales" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center">
            View Details <FaArrowRight className="ml-1 text-xs" />
          </Link>
        </div>
        <SalesOverview />
      </div>

      {totalAlerts > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white font-display">Alerts</h2>
            <Link to="/alerts" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center">
              View All <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover p-4 sm:p-6 transition-all duration-300">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                <FaExclamationTriangle className="text-lg sm:text-xl text-amber-500 dark:text-amber-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 font-display">
                Attention Required ({totalAlerts})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {alerts.lowStock.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <FaBoxOpen className="mr-1.5 sm:mr-2" /> Low Stock Items
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {alerts.lowStock.slice(0, 3).map(medicine => (
                      <li key={medicine.id} className="flex justify-between p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{medicine.name}</span>
                        <span className="text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm">{medicine.quantity} left</span>
                      </li>
                    ))}
                    {alerts.lowStock.length > 3 && (
                      <li className="text-center p-1.5 sm:p-2">
                        <Link to="/alerts" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                          +{alerts.lowStock.length - 3} more items
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {alerts.expiringSoon.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-amber-600 dark:text-amber-400 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <FaCalendarAlt className="mr-1.5 sm:mr-2" /> Expiring Soon
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {alerts.expiringSoon.slice(0, 3).map(medicine => {
                      const daysLeft = getDaysUntilExpiry(medicine.expiryDate);
                      return (
                        <li key={medicine.id} className="flex justify-between p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                          <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{medicine.name}</span>
                          <span className={`font-bold text-xs sm:text-sm ${daysLeft < 7 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {daysLeft} days left
                          </span>
                        </li>
                      );
                    })}
                    {alerts.expiringSoon.length > 3 && (
                      <li className="text-center p-1.5 sm:p-2">
                        <Link to="/alerts" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                          +{alerts.expiringSoon.length - 3} more items
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

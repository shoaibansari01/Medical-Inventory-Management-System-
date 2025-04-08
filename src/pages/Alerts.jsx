import { useState, useEffect } from 'react';
import { FaBell, FaExclamationTriangle, FaCalendarAlt, FaBoxes, FaDownload } from 'react-icons/fa';
import { alertService } from '../services/storageService';
import StockAlertList from '../components/alerts/StockAlertList';

const Alerts = () => {
  const [alerts, setAlerts] = useState({ lowStock: [], expiringSoon: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = () => {
      setLoading(true);
      const allAlerts = alertService.getAllAlerts();
      setAlerts(allAlerts);
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  // Total number of alerts
  const totalAlerts = alerts.lowStock.length + alerts.expiringSoon.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
            <FaBell className="text-2xl text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Alerts & Notifications</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
      ) : totalAlerts > 0 ? (
        <div className="space-y-8">
          {/* Tabs for different alert types */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'all' ?
                'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400' :
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              All Alerts ({totalAlerts})
            </button>
            <button
              onClick={() => setActiveTab('low')}
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'low' ?
                'border-b-2 border-red-500 text-red-600 dark:text-red-400' :
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              Low Stock ({alerts.lowStock.length})
            </button>
            <button
              onClick={() => setActiveTab('expiring')}
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'expiring' ?
                'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400' :
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              Expiring Soon ({alerts.expiringSoon.length})
            </button>
          </div>

          {/* Alert list with the ability to add stock and export to Excel */}
          <div className="card">
            <StockAlertList type={activeTab} />
          </div>
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center py-12">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
            <FaExclamationTriangle className="text-3xl text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Alerts</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            You don't have any alerts at the moment. This is good news! Your inventory is in good shape.
          </p>
        </div>
      )}
    </div>
  );
};

export default Alerts;

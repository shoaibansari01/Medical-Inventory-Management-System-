import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaExclamationTriangle, FaCalendarAlt, FaBoxes } from 'react-icons/fa';
import { alertService } from '../services/storageService';
import { formatDate, getDaysUntilExpiry } from '../utils/dateUtils';

const Alerts = () => {
  const [alerts, setAlerts] = useState({ lowStock: [], expiringSoon: [] });
  const [loading, setLoading] = useState(true);
  
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
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <FaBell className="text-2xl text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Alerts & Notifications</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : totalAlerts > 0 ? (
        <div className="space-y-8">
          {alerts.lowStock.length > 0 && (
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <FaBoxes className="text-xl text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Low Stock Alerts ({alerts.lowStock.length})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alerts.lowStock.map(medicine => (
                      <tr key={medicine.id} className="hover:bg-red-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{medicine.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-red-600">
                            {medicine.quantity} left
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to="/stock" 
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Add Stock
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {alerts.expiringSoon.length > 0 && (
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <FaCalendarAlt className="text-xl text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Expiring Soon Alerts ({alerts.expiringSoon.length})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Days Left
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alerts.expiringSoon.map(medicine => {
                      const daysLeft = getDaysUntilExpiry(medicine.expiryDate);
                      
                      return (
                        <tr key={medicine.id} className="hover:bg-amber-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{medicine.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(medicine.expiryDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${
                              daysLeft < 7 ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              {daysLeft} days
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {medicine.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              to={`/medicines/edit/${medicine.id}`} 
                              className="text-primary-600 hover:text-primary-900"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center py-12">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <FaExclamationTriangle className="text-3xl text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Alerts</h2>
          <p className="text-gray-500 text-center max-w-md">
            You don't have any alerts at the moment. This is good news! Your inventory is in good shape.
          </p>
        </div>
      )}
    </div>
  );
};

export default Alerts;

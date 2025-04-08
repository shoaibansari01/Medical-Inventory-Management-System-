import React, { useState, useEffect } from 'react';
import { FaDownload, FaPlus, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import { formatDate } from '../../utils/dateUtils';
import { medicineService } from '../../services/storageService';
import * as XLSX from 'xlsx';

const StockAlertList = ({ type = 'all' }) => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch low stock and expiring items
  useEffect(() => {
    const fetchAlerts = () => {
      // Get all medicines
      const medicines = medicineService.getAll();
      
      // Filter low stock items (less than 10 units)
      const lowStock = medicines.filter(med => med.quantity < 10);
      setLowStockItems(lowStock);
      
      // Filter expiring items (within 30 days)
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      const expiring = medicines.filter(med => {
        if (!med.expiryDate) return false;
        const expiryDate = new Date(med.expiryDate);
        return expiryDate > today && expiryDate <= thirtyDaysFromNow;
      });
      
      setExpiringItems(expiring);
      
      // Initialize quantities state
      const initialQuantities = {};
      [...lowStock, ...expiring].forEach(med => {
        initialQuantities[med.id] = 0;
      });
      setQuantities(initialQuantities);
    };
    
    fetchAlerts();
  }, []);

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({
      ...prev,
      [id]: parseInt(value) || 0
    }));
  };

  // Handle add to stock
  const handleAddToStock = (medicine) => {
    const quantityToAdd = quantities[medicine.id];
    
    if (quantityToAdd <= 0) {
      return;
    }
    
    // Update medicine quantity
    const updatedMedicine = {
      ...medicine,
      quantity: medicine.quantity + quantityToAdd
    };
    
    // Save to storage
    medicineService.update(updatedMedicine);
    
    // Show success message
    setSuccessMessage(`Added ${quantityToAdd} units to ${medicine.name}`);
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Reset quantity
    setQuantities(prev => ({
      ...prev,
      [medicine.id]: 0
    }));
    
    // Refresh lists
    const medicines = medicineService.getAll();
    setLowStockItems(medicines.filter(med => med.quantity < 10));
  };

  // Export to Excel
  const exportToExcel = () => {
    // Prepare data for export
    const dataToExport = [];
    
    if (type === 'all' || type === 'low') {
      lowStockItems.forEach(item => {
        dataToExport.push({
          'Medicine Name': item.name,
          'Category': item.category,
          'Current Stock': item.quantity,
          'Recommended Order': 10 - item.quantity,
          'Alert Type': 'Low Stock',
          'Purchase Price': item.purchasePrice,
          'Selling Price': item.sellingPrice
        });
      });
    }
    
    if (type === 'all' || type === 'expiring') {
      expiringItems.forEach(item => {
        dataToExport.push({
          'Medicine Name': item.name,
          'Category': item.category,
          'Current Stock': item.quantity,
          'Expiry Date': formatDate(item.expiryDate),
          'Alert Type': 'Expiring Soon',
          'Purchase Price': item.purchasePrice,
          'Selling Price': item.sellingPrice
        });
      });
    }
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Alerts');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'stock_alerts.xlsx');
  };

  // Get items to display based on type
  const getItemsToDisplay = () => {
    if (type === 'low') return lowStockItems;
    if (type === 'expiring') return expiringItems;
    return [...lowStockItems, ...expiringItems];
  };

  const itemsToDisplay = getItemsToDisplay();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {type === 'low' ? 'Low Stock Alerts' : 
           type === 'expiring' ? 'Expiring Soon Alerts' : 
           'Stock Alerts'}
        </h3>
        <button 
          onClick={exportToExcel}
          className="btn btn-primary text-sm py-1.5 px-3 flex items-center"
        >
          <FaDownload className="mr-1" /> Export to Excel
        </button>
      </div>
      
      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-2 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
      {itemsToDisplay.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No alerts to display</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Medicine
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Alert Type
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Add Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {itemsToDisplay.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.category}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      item.quantity < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.quantity} units
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {item.quantity < 10 ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                        <FaExclamationTriangle className="mr-1 mt-0.5" /> Low Stock
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                        <FaCalendarAlt className="mr-1 mt-0.5" /> Expires {formatDate(item.expiryDate)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={quantities[item.id] || 0}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-16 py-1 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => handleAddToStock(item)}
                        disabled={!quantities[item.id] || quantities[item.id] <= 0}
                        className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockAlertList;

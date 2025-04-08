import { useState, useEffect } from 'react';
import { FaBoxes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { medicineService } from '../../services/storageService';
import { calculateInventoryValue, formatCurrency } from '../../utils/calculationUtils';
import BarChart from '../charts/BarChart';

const StockSummary = () => {
  const [medicines, setMedicines] = useState([]);
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const allMedicines = medicineService.getAll();
      setMedicines(allMedicines);

      // Calculate totals
      setTotalMedicines(allMedicines.length);

      const totalQuantity = allMedicines.reduce((sum, medicine) => sum + (medicine.quantity || 0), 0);
      setTotalItems(totalQuantity);

      const value = calculateInventoryValue(allMedicines);
      setInventoryValue(value);

      // Prepare chart data - top 5 medicines by quantity
      const sortedByQuantity = [...allMedicines]
        .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
        .slice(0, 5);

      const chartData = sortedByQuantity.map(medicine => ({
        label: medicine.name.length > 10 ? medicine.name.substring(0, 10) + '...' : medicine.name,
        value: medicine.quantity || 0
      }));

      setChartData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="card flex items-center">
        <div className="mr-3 sm:mr-4 bg-primary-100 dark:bg-primary-900/30 p-2 sm:p-3 rounded-full">
          <FaBoxes className="text-xl sm:text-2xl text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Total Medicines</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{totalMedicines}</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Different medicine types</p>
        </div>
      </div>

      <div className="card flex items-center">
        <div className="mr-3 sm:mr-4 bg-secondary-100 dark:bg-secondary-900/30 p-2 sm:p-3 rounded-full">
          <FaArrowUp className="text-xl sm:text-2xl text-secondary-600 dark:text-secondary-400" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Total Items</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Items in inventory</p>
        </div>
      </div>

      <div className="card flex items-center sm:col-span-2 lg:col-span-1">
        <div className="mr-3 sm:mr-4 bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-full">
          <FaArrowDown className="text-xl sm:text-2xl text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Inventory Value</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(inventoryValue)}</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total purchase value</p>
        </div>
      </div>

      <div className="card col-span-1 sm:col-span-2 lg:col-span-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">Top Medicines by Quantity</h3>
        <div className="h-[250px] sm:h-[300px]">
          <BarChart data={chartData} height="100%" colors={['#0ea5e9', '#0284c7', '#0369a1']} />
        </div>
      </div>
    </div>
  );
};

export default StockSummary;

import { useState, useEffect } from 'react';
import { FaMedal } from 'react-icons/fa';
import { salesService } from '../../services/storageService';
import { formatCurrency } from '../../utils/calculationUtils';
import PieChart from '../charts/PieChart';

const TopMedicines = () => {
  const [topMedicines, setTopMedicines] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const topSellingMedicines = salesService.getTopSellingMedicines(5);
      setTopMedicines(topSellingMedicines);
    };

    fetchData();
  }, []);

  // Prepare data for pie chart
  const chartData = topMedicines.slice(0, 5).map(medicine => ({
    label: medicine.medicineName,
    value: medicine.totalQuantity
  }));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Top Selling Medicines</h3>
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1.5 sm:p-2 rounded-full">
          <FaMedal className="text-lg sm:text-xl text-yellow-600 dark:text-yellow-400" />
        </div>
      </div>

      {topMedicines.length > 0 ? (
        <div>
          <div className="mb-3 sm:mb-4 h-[180px] sm:h-[220px]">
            <PieChart
              data={chartData}
              height="100%"
              colors={['#f59e0b', '#0ea5e9', '#10b981', '#8b5cf6', '#ec4899']}
            />
          </div>

          <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
            {topMedicines.slice(0, 5).map((medicine, index) => (
              <div key={medicine.medicineId} className="flex items-center p-1.5 sm:p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full mr-2 sm:mr-3"
                  style={{ backgroundColor: index === 0 ? '#f59e0b' : index === 1 ? '#0ea5e9' : index === 2 ? '#10b981' : index === 3 ? '#8b5cf6' : '#ec4899' }}>
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>

                <div className="flex-1 min-w-0"> {/* Added min-w-0 to ensure truncation works */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate max-w-[100px] sm:max-w-[150px]">
                      {medicine.medicineName}
                    </h4>
                    <span className="text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400 ml-1">
                      {formatCurrency(medicine.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 sm:h-1.5">
                      <div
                        className="h-1 sm:h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(100, (medicine.totalQuantity / (topMedicines[0]?.totalQuantity || 1)) * 100)}%`,
                          backgroundColor: index === 0 ? '#f59e0b' : index === 1 ? '#0ea5e9' : index === 2 ? '#10b981' : index === 3 ? '#8b5cf6' : '#ec4899'
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 min-w-[30px] sm:min-w-[40px] text-right">
                      {medicine.totalQuantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
          <p>No sales data available yet</p>
        </div>
      )}
    </div>
  );
};

export default TopMedicines;

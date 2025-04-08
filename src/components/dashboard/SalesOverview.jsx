import { useState, useEffect } from 'react';
import { FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { salesService } from '../../services/storageService';
import { formatCurrency } from '../../utils/calculationUtils';
import { getMonthName } from '../../utils/dateUtils';
import LineChart from '../charts/LineChart';

const SalesOverview = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      // Get monthly sales data
      const salesData = salesService.getMonthlySalesData();
      setMonthlySales(salesData);

      // Calculate totals
      const totalSalesCount = salesData.reduce((sum, month) => sum + month.totalSales, 0);
      const totalRevenueAmount = salesData.reduce((sum, month) => sum + month.totalAmount, 0);

      setTotalSales(totalSalesCount);
      setTotalRevenue(totalRevenueAmount);

      // Prepare chart data - last 6 months
      const last6Months = [...salesData]
        .sort((a, b) => new Date(b.month) - new Date(a.month))
        .slice(0, 6)
        .reverse();

      const chartData = last6Months.map(month => {
        const [year, monthNum] = month.month.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1);

        return {
          label: date.toLocaleString('default', { month: 'short' }),
          value: month.totalSales
        };
      });

      setChartData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="card flex items-center">
        <div className="mr-3 sm:mr-4 bg-primary-100 dark:bg-primary-900/30 p-2 sm:p-3 rounded-full">
          <FaChartLine className="text-xl sm:text-2xl text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Total Sales</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{totalSales}</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Items sold</p>
        </div>
      </div>

      <div className="card flex items-center">
        <div className="mr-3 sm:mr-4 bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-full">
          <FaCalendarAlt className="text-xl sm:text-2xl text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Total Revenue</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">All time revenue</p>
        </div>
      </div>

      <div className="card col-span-1 sm:col-span-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">Monthly Sales Trend</h3>
        <div className="h-[250px] sm:h-[300px]">
          <LineChart data={chartData} height="100%" title="" areaChart={true} />
        </div>
      </div>

      <div className="card col-span-1 sm:col-span-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">Monthly Sales Overview</h3>
        <div className="overflow-x-auto -mx-4 sm:-mx-5 md:-mx-6 px-4 sm:px-5 md:px-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Items Sold
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {monthlySales.length > 0 ? (
                monthlySales
                  .sort((a, b) => new Date(b.month) - new Date(a.month))
                  .slice(0, 5)
                  .map((month, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {getMonthName(month.month + '-01')}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-300">{month.totalSales}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-300">
                          {formatCurrency(month.totalAmount)}
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-3 sm:px-6 py-2 sm:py-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    No sales data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;

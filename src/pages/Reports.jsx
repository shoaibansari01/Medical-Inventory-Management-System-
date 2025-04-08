import { useState, useEffect } from 'react';
import { FaChartBar, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import { salesService, medicineService } from '../services/storageService';
import { formatCurrency } from '../utils/calculationUtils';
import { formatDate, getMonthName } from '../utils/dateUtils';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';

const Reports = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [topMedicines, setTopMedicines] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      // Get monthly sales data
      const salesData = salesService.getMonthlySalesData();
      setMonthlySales(salesData);

      // Get top selling medicines
      const topSellingMedicines = salesService.getTopSellingMedicines(10);
      setTopMedicines(topSellingMedicines);

      // Get all medicines
      const allMedicines = medicineService.getAll();
      setMedicines(allMedicines);

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

      setLoading(false);
    };

    fetchData();
  }, []);

  // Export report as CSV
  const exportCSV = (data, filename) => {
    // Create CSV content
    let csvContent = '';

    if (filename === 'monthly_sales.csv') {
      // Headers
      csvContent = 'Month,Total Sales,Total Amount\n';

      // Data
      data.forEach(item => {
        csvContent += `${item.month},${item.totalSales},${item.totalAmount}\n`;
      });
    } else if (filename === 'top_medicines.csv') {
      // Headers
      csvContent = 'Medicine Name,Total Quantity,Total Amount\n';

      // Data
      data.forEach(item => {
        csvContent += `${item.medicineName},${item.totalQuantity},${item.totalAmount}\n`;
      });
    }

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <FaChartBar className="text-2xl text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Monthly Sales Trend</h2>
              <button
                onClick={() => exportCSV(monthlySales, 'monthly_sales.csv')}
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
              >
                <FaDownload className="mr-2" /> Export CSV
              </button>
            </div>

            <div className="h-80">
              <LineChart data={chartData} height={300} title="Monthly Sales" areaChart={true} />
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlySales.length > 0 ? (
                    monthlySales
                      .sort((a, b) => new Date(b.month) - new Date(a.month))
                      .map((month, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {getMonthName(month.month + '-01')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{month.totalSales}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatCurrency(month.totalAmount)}
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No sales data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Top Selling Medicines</h2>
              <button
                onClick={() => exportCSV(topMedicines, 'top_medicines.csv')}
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
              >
                <FaDownload className="mr-2" /> Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <PieChart
                  data={topMedicines.slice(0, 5).map(medicine => ({
                    label: medicine.medicineName,
                    value: medicine.totalQuantity
                  }))}
                  height={300}
                  colors={['#1a73f8', '#2c9d8a', '#e94e63', '#f59e0b', '#8b5cf6']}
                />
              </div>
              <div>
                <BarChart
                  data={topMedicines.slice(0, 5).map(medicine => ({
                    label: medicine.medicineName,
                    value: medicine.totalQuantity
                  }))}
                  height={300}
                  colors={['#1a73f8', '#2c9d8a', '#e94e63']}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Quantity Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topMedicines.length > 0 ? (
                    topMedicines.map((medicine, index) => {
                      const currentMedicine = medicines.find(m => m.id === medicine.medicineId);
                      const currentStock = currentMedicine ? currentMedicine.quantity || 0 : 0;

                      return (
                        <tr key={medicine.medicineId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {medicine.medicineName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{medicine.totalQuantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatCurrency(medicine.totalAmount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${currentStock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                              {currentStock}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No sales data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Status</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-primary-800">Total Medicines</h3>
                    <p className="text-3xl font-bold text-primary-600">{medicines.length}</p>
                    <p className="text-sm text-gray-500">Different medicine types</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-green-800">In Stock</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {medicines.filter(m => (m.quantity || 0) > 0).length}
                    </p>
                    <p className="text-sm text-gray-500">Medicines with stock</p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-red-800">Out of Stock</h3>
                    <p className="text-3xl font-bold text-red-600">
                      {medicines.filter(m => (m.quantity || 0) === 0).length}
                    </p>
                    <p className="text-sm text-gray-500">Medicines with zero stock</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white p-4 rounded-lg shadow-sm h-full">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Inventory by Category</h3>
                  <BarChart
                    data={(() => {
                      // Group medicines by category and count
                      const categories = {};
                      medicines.forEach(medicine => {
                        if (!categories[medicine.category]) {
                          categories[medicine.category] = 0;
                        }
                        categories[medicine.category]++;
                      });

                      // Convert to chart data format
                      return Object.entries(categories)
                        .map(([category, count]) => ({
                          label: category,
                          value: count
                        }))
                        .sort((a, b) => b.value - a.value);
                    })()}
                    height={300}
                    colors={['#2c9d8a', '#3494ff', '#e94e63']}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

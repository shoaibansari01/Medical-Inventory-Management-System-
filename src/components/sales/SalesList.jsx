import { useState } from 'react';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { formatDateTime } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/calculationUtils';

const SalesList = ({ sales, medicines }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [medicineFilter, setMedicineFilter] = useState('');
  
  // Filter sales
  const filteredSales = sales
    .filter(sale => {
      // Filter by search term
      const matchesSearch = 
        sale.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sale.notes && sale.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by date range
      const saleDate = new Date(sale.timestamp);
      const matchesStartDate = !startDate || saleDate >= new Date(startDate);
      const matchesEndDate = !endDate || saleDate <= new Date(endDate + 'T23:59:59');
      
      // Filter by medicine
      const matchesMedicine = medicineFilter === '' || sale.medicineId === medicineFilter;
      
      return matchesSearch && matchesStartDate && matchesEndDate && matchesMedicine;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Calculate total amount
  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  
  // Calculate total quantity
  const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
  
  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-gray-400" />
          <input
            type="date"
            className="input"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-gray-400" />
          <input
            type="date"
            className="input"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="input"
            value={medicineFilter}
            onChange={(e) => setMedicineFilter(e.target.value)}
          >
            <option value="">All Medicines</option>
            {medicines.map(medicine => (
              <option key={medicine.id} value={medicine.id}>
                {medicine.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-primary-800">Total Sales</h3>
          <p className="text-3xl font-bold text-primary-600">{totalQuantity} items</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(sale.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.medicineName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sale.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(sale.medicinePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-600">
                        {formatCurrency(sale.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {sale.customerName || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {sale.notes || '-'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No sales found
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

export default SalesList;

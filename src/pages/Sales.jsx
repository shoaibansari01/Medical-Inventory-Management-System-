import { useState, useEffect } from 'react';
import { FaShoppingCart, FaHistory } from 'react-icons/fa';
import { salesService, medicineService } from '../services/storageService';
import SaleForm from '../components/sales/SaleForm';
import SalesList from '../components/sales/SalesList';

const Sales = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch sales and medicines
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      
      const allSales = salesService.getAllSales();
      setSales(allSales);
      
      const allMedicines = medicineService.getAll();
      setMedicines(allMedicines);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Handle sale submission
  const handleSaleSubmit = (formData) => {
    const result = salesService.recordSale(formData);
    
    if (result) {
      // Update sales
      const allSales = salesService.getAllSales();
      setSales(allSales);
      
      // Update medicines
      const allMedicines = medicineService.getAll();
      setMedicines(allMedicines);
      
      // Show success message
      alert('Sale recorded successfully!');
      
      // Switch to sales list tab
      setActiveTab('list');
    } else {
      alert('Failed to record sale. Please try again.');
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <FaShoppingCart className="text-2xl text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Sales Tracking</h1>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'form'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('form')}
            >
              Record Sale
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('list')}
            >
              Sales History
            </button>
          </nav>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card">
          {activeTab === 'form' ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Record New Sale
              </h2>
              <SaleForm onSubmit={handleSaleSubmit} />
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Sales History
              </h2>
              <SalesList sales={sales} medicines={medicines} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sales;

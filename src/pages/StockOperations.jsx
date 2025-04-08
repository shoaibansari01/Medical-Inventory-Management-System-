import { useState, useEffect } from 'react';
import { FaBoxes, FaHistory } from 'react-icons/fa';
import { stockService, medicineService } from '../services/storageService';
import StockForm from '../components/stock/StockForm';
import StockHistory from '../components/stock/StockHistory';

const StockOperations = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [stockHistory, setStockHistory] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch stock history and medicines
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      
      const history = stockService.getStockHistory();
      setStockHistory(history);
      
      const allMedicines = medicineService.getAll();
      setMedicines(allMedicines);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Handle stock operation submission
  const handleStockOperation = (formData) => {
    let result;
    
    if (formData.type === 'add') {
      result = stockService.addStock(
        formData.medicineId,
        formData.quantity,
        formData.notes
      );
    } else {
      result = stockService.reduceStock(
        formData.medicineId,
        formData.quantity,
        formData.notes
      );
    }
    
    if (result) {
      // Update stock history
      const history = stockService.getStockHistory();
      setStockHistory(history);
      
      // Update medicines
      const allMedicines = medicineService.getAll();
      setMedicines(allMedicines);
      
      // Show success message
      alert(`Stock ${formData.type === 'add' ? 'added' : 'reduced'} successfully!`);
    } else {
      alert('Failed to perform stock operation. Please try again.');
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <FaBoxes className="text-2xl text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Stock Operations</h1>
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
              Stock Operation Form
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Stock History
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
                Add or Reduce Stock
              </h2>
              <StockForm onSubmit={handleStockOperation} />
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Stock Operation History
              </h2>
              <StockHistory stockHistory={stockHistory} medicines={medicines} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockOperations;

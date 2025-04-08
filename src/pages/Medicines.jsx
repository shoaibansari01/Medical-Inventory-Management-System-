import { useState, useEffect } from 'react';
import { medicineService } from '../services/storageService';
import MedicineList from '../components/medicine/MedicineList';
import { FaPills } from 'react-icons/fa';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch medicines
  useEffect(() => {
    const fetchMedicines = () => {
      setLoading(true);
      const allMedicines = medicineService.getAll();
      setMedicines(allMedicines);
      setLoading(false);
    };
    
    fetchMedicines();
  }, []);
  
  // Handle delete medicine
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      medicineService.delete(id);
      setMedicines(medicines.filter(medicine => medicine.id !== id));
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          <FaPills className="text-2xl text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Medicine Management</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <MedicineList medicines={medicines} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Medicines;

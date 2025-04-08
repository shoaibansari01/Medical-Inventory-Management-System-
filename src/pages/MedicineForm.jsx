import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { medicineService } from '../services/storageService';
import MedicineFormComponent from '../components/medicine/MedicineForm';
import { FaPills, FaPlus, FaEdit } from 'react-icons/fa';

const MedicineForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;
  
  // Fetch medicine if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchedMedicine = medicineService.getById(id);
      
      if (fetchedMedicine) {
        setMedicine(fetchedMedicine);
      } else {
        navigate('/medicines');
      }
      
      setLoading(false);
    }
  }, [id, isEditing, navigate]);
  
  // Handle form submission
  const handleSubmit = (formData) => {
    if (isEditing) {
      medicineService.update(id, formData);
    } else {
      medicineService.add(formData);
    }
    
    navigate('/medicines');
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-3 rounded-full mr-4">
          {isEditing ? (
            <FaEdit className="text-2xl text-primary-600" />
          ) : (
            <FaPlus className="text-2xl text-primary-600" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Edit Medicine' : 'Add New Medicine'}
        </h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card">
          <MedicineFormComponent 
            medicine={medicine} 
            onSubmit={handleSubmit} 
            isEditing={isEditing} 
          />
        </div>
      )}
    </div>
  );
};

export default MedicineForm;

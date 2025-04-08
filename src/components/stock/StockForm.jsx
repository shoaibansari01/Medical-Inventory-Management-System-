import { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaSave } from 'react-icons/fa';
import { validateForm, required, isNumber, isPositive } from '../../utils/validationUtils';
import { medicineService } from '../../services/storageService';

const StockForm = ({ onSubmit }) => {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({
    medicineId: '',
    quantity: '',
    type: 'add',
    notes: '',
  });
  
  const [errors, setErrors] = useState({});
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  
  // Fetch medicines
  useEffect(() => {
    const allMedicines = medicineService.getAll();
    setMedicines(allMedicines);
  }, []);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update selected medicine when medicineId changes
    if (name === 'medicineId') {
      const medicine = medicines.find(m => m.id === value);
      setSelectedMedicine(medicine || null);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validations = {
      medicineId: [required],
      quantity: [required, isNumber, isPositive],
    };
    
    const formErrors = validateForm(formData, validations);
    
    // Additional validation for reduce operation
    if (formData.type === 'reduce' && selectedMedicine) {
      const quantity = parseInt(formData.quantity);
      if (quantity > (selectedMedicine.quantity || 0)) {
        formErrors.quantity = `Cannot reduce more than available quantity (${selectedMedicine.quantity || 0})`;
      }
    }
    
    setErrors(formErrors);
    
    // If no errors, submit form
    if (Object.keys(formErrors).length === 0) {
      onSubmit({
        ...formData,
        quantity: parseInt(formData.quantity),
      });
      
      // Reset form
      setFormData({
        medicineId: '',
        quantity: '',
        type: 'add',
        notes: '',
      });
      setSelectedMedicine(null);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="medicineId" className="block text-sm font-medium text-gray-700 mb-1">
          Select Medicine*
        </label>
        <select
          id="medicineId"
          name="medicineId"
          value={formData.medicineId}
          onChange={handleChange}
          className={`input ${errors.medicineId ? 'border-red-500' : ''}`}
        >
          <option value="">Select Medicine</option>
          {medicines.map(medicine => (
            <option key={medicine.id} value={medicine.id}>
              {medicine.name} ({medicine.quantity || 0} in stock)
            </option>
          ))}
        </select>
        {errors.medicineId && (
          <p className="mt-1 text-sm text-red-600">{errors.medicineId}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Operation Type*
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="add"
              checked={formData.type === 'add'}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 flex items-center">
              <FaPlus className="text-green-600 mr-1" /> Add Stock
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="reduce"
              checked={formData.type === 'reduce'}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 flex items-center">
              <FaMinus className="text-red-600 mr-1" /> Reduce Stock
            </span>
          </label>
        </div>
      </div>
      
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Quantity*
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          value={formData.quantity}
          onChange={handleChange}
          className={`input ${errors.quantity ? 'border-red-500' : ''}`}
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          className="input"
          placeholder="Optional notes about this stock operation"
        ></textarea>
      </div>
      
      {selectedMedicine && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Selected Medicine Details</h4>
          <p><span className="font-medium">Name:</span> {selectedMedicine.name}</p>
          <p><span className="font-medium">Category:</span> {selectedMedicine.category}</p>
          <p><span className="font-medium">Current Stock:</span> {selectedMedicine.quantity || 0}</p>
          <p>
            <span className="font-medium">New Stock After Operation:</span>{' '}
            {formData.quantity && !isNaN(parseInt(formData.quantity))
              ? formData.type === 'add'
                ? (selectedMedicine.quantity || 0) + parseInt(formData.quantity)
                : (selectedMedicine.quantity || 0) - parseInt(formData.quantity)
              : selectedMedicine.quantity || 0}
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary flex items-center"
        >
          <FaSave className="mr-2" /> Submit
        </button>
      </div>
    </form>
  );
};

export default StockForm;

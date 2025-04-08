import { useState, useEffect } from 'react';
import { FaShoppingCart, FaSave } from 'react-icons/fa';
import { validateForm, required, isNumber, isPositive } from '../../utils/validationUtils';
import { medicineService } from '../../services/storageService';
import { formatCurrency } from '../../utils/calculationUtils';
import { getCurrentDateISO } from '../../utils/dateUtils';

const SaleForm = ({ onSubmit }) => {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({
    medicineId: '',
    quantity: '',
    date: getCurrentDateISO(),
    customerName: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState({});
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  
  // Fetch medicines
  useEffect(() => {
    const allMedicines = medicineService.getAll();
    // Only show medicines with stock
    const medicinesWithStock = allMedicines.filter(medicine => (medicine.quantity || 0) > 0);
    setMedicines(medicinesWithStock);
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
  
  // Calculate total amount
  const calculateTotal = () => {
    if (!selectedMedicine || !formData.quantity) return 0;
    
    const quantity = parseInt(formData.quantity);
    const price = selectedMedicine.sellingPrice || 0;
    
    return quantity * price;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validations = {
      medicineId: [required],
      quantity: [required, isNumber, isPositive],
      date: [required],
    };
    
    const formErrors = validateForm(formData, validations);
    
    // Additional validation for quantity
    if (selectedMedicine) {
      const quantity = parseInt(formData.quantity);
      if (quantity > (selectedMedicine.quantity || 0)) {
        formErrors.quantity = `Cannot sell more than available quantity (${selectedMedicine.quantity || 0})`;
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
        date: getCurrentDateISO(),
        customerName: '',
        notes: '',
      });
      setSelectedMedicine(null);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Sale Date*
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`input ${errors.date ? 'border-red-500' : ''}`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="input"
          />
        </div>
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
          placeholder="Optional notes about this sale"
        ></textarea>
      </div>
      
      {selectedMedicine && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Sale Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Medicine:</span> {selectedMedicine.name}</p>
              <p><span className="font-medium">Category:</span> {selectedMedicine.category}</p>
              <p><span className="font-medium">Available Stock:</span> {selectedMedicine.quantity || 0}</p>
            </div>
            <div>
              <p>
                <span className="font-medium">Unit Price:</span>{' '}
                {formatCurrency(selectedMedicine.sellingPrice)}
              </p>
              <p>
                <span className="font-medium">Quantity:</span>{' '}
                {formData.quantity || 0}
              </p>
              <p className="text-lg font-bold text-primary-600">
                <span className="font-medium">Total Amount:</span>{' '}
                {formatCurrency(calculateTotal())}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary flex items-center"
        >
          <FaShoppingCart className="mr-2" /> Record Sale
        </button>
      </div>
    </form>
  );
};

export default SaleForm;

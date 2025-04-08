import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { validateForm, required, isNumber, isPositive } from '../../utils/validationUtils';
import MedicinePreview from './MedicinePreview';

const MedicineForm = ({ medicine, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantity: 0,
    expiryDate: '',
    purchasePrice: '',
    sellingPrice: '',
  });

  const [errors, setErrors] = useState({});
  const [modelType, setModelType] = useState('pill');
  const navigate = useNavigate();

  // Set form data if medicine is provided (editing mode)
  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        category: medicine.category || '',
        description: medicine.description || '',
        quantity: medicine.quantity || 0,
        expiryDate: medicine.expiryDate || '',
        purchasePrice: medicine.purchasePrice || '',
        sellingPrice: medicine.sellingPrice || '',
      });

      // Set model type based on category
      if (medicine.category) {
        const category = medicine.category.toLowerCase();
        if (category.includes('tablet') || category.includes('pill')) {
          setModelType('pill');
        } else if (category.includes('syrup') || category.includes('liquid')) {
          setModelType('bottle');
        } else {
          setModelType('box');
        }
      }
    }
  }, [medicine]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update model type when category changes
    if (name === 'category') {
      const category = value.toLowerCase();
      if (category.includes('tablet') || category.includes('pill')) {
        setModelType('pill');
      } else if (category.includes('syrup') || category.includes('liquid')) {
        setModelType('bottle');
      } else {
        setModelType('box');
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validations = {
      name: [required],
      category: [required],
      purchasePrice: [required, isNumber, isPositive],
      sellingPrice: [required, isNumber, isPositive],
    };

    const formErrors = validateForm(formData, validations);
    setErrors(formErrors);

    // If no errors, submit form
    if (Object.keys(formErrors).length === 0) {
      onSubmit({
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Medicine Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select Category</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Cream">Cream</option>
                <option value="Ointment">Ointment</option>
                <option value="Drop">Drop</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="input"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="input"
                disabled={isEditing}
              />
              {isEditing && (
                <p className="mt-1 text-xs text-gray-500">
                  Use Stock Operations to change quantity
                </p>
              )}
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="text"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className={`input pl-7 ${errors.purchasePrice ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.purchasePrice && (
                <p className="mt-1 text-sm text-red-600">{errors.purchasePrice}</p>
              )}
            </div>

            <div>
              <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="text"
                  id="sellingPrice"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  className={`input pl-7 ${errors.sellingPrice ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.sellingPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.sellingPrice}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/medicines')}
              className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
            >
              <FaSave className="mr-2" /> {isEditing ? 'Update' : 'Save'} Medicine
            </button>
          </div>
        </form>
      </div>

      <div className="md:col-span-1">
        <div className="card h-full flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Medicine Preview</h3>
          <div className="mb-4">
            <MedicinePreview type={modelType} color="#0ea5e9" />
          </div>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            This is a preview of how your medicine might look.
            <br />
            The model type is based on the category.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicineForm;

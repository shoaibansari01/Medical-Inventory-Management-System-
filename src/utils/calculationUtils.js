// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

// Calculate profit
export const calculateProfit = (sellingPrice, purchasePrice, quantity = 1) => {
  if (!sellingPrice || !purchasePrice) return 0;
  return (sellingPrice - purchasePrice) * quantity;
};

// Calculate profit margin
export const calculateProfitMargin = (sellingPrice, purchasePrice) => {
  if (!sellingPrice || !purchasePrice || purchasePrice === 0) return 0;
  return ((sellingPrice - purchasePrice) / purchasePrice) * 100;
};

// Calculate total value of inventory
export const calculateInventoryValue = (medicines) => {
  if (!medicines || !medicines.length) return 0;
  return medicines.reduce((total, medicine) => {
    const quantity = medicine.quantity || 0;
    const purchasePrice = medicine.purchasePrice || 0;
    return total + (quantity * purchasePrice);
  }, 0);
};

// Calculate potential sales value
export const calculatePotentialSalesValue = (medicines) => {
  if (!medicines || !medicines.length) return 0;
  return medicines.reduce((total, medicine) => {
    const quantity = medicine.quantity || 0;
    const sellingPrice = medicine.sellingPrice || 0;
    return total + (quantity * sellingPrice);
  }, 0);
};

// Calculate potential profit
export const calculatePotentialProfit = (medicines) => {
  if (!medicines || !medicines.length) return 0;
  return medicines.reduce((total, medicine) => {
    const quantity = medicine.quantity || 0;
    const sellingPrice = medicine.sellingPrice || 0;
    const purchasePrice = medicine.purchasePrice || 0;
    return total + ((sellingPrice - purchasePrice) * quantity);
  }, 0);
};

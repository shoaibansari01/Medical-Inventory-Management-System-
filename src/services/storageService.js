// Storage keys
const KEYS = {
  MEDICINES: 'medInventory_medicines',
  STOCK_HISTORY: 'medInventory_stockHistory',
  SALES: 'medInventory_sales',
};

// Get data from localStorage
const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Save data to localStorage
const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Medicine Service
export const medicineService = {
  // Get all medicines
  getAll: () => {
    const medicines = getData(KEYS.MEDICINES) || [];
    return medicines;
  },

  // Get medicine by ID
  getById: (id) => {
    const medicines = getData(KEYS.MEDICINES) || [];
    return medicines.find(medicine => medicine.id === id) || null;
  },

  // Add new medicine
  add: (medicine) => {
    const medicines = getData(KEYS.MEDICINES) || [];
    const newMedicine = {
      ...medicine,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    medicines.push(newMedicine);
    saveData(KEYS.MEDICINES, medicines);
    return newMedicine;
  },

  // Update medicine
  update: (id, updatedMedicine) => {
    const medicines = getData(KEYS.MEDICINES) || [];
    const index = medicines.findIndex(medicine => medicine.id === id);
    
    if (index !== -1) {
      medicines[index] = {
        ...medicines[index],
        ...updatedMedicine,
        updatedAt: new Date().toISOString(),
      };
      saveData(KEYS.MEDICINES, medicines);
      return medicines[index];
    }
    return null;
  },

  // Delete medicine
  delete: (id) => {
    const medicines = getData(KEYS.MEDICINES) || [];
    const filteredMedicines = medicines.filter(medicine => medicine.id !== id);
    saveData(KEYS.MEDICINES, filteredMedicines);
    return true;
  },

  // Search medicines
  search: (query) => {
    const medicines = getData(KEYS.MEDICINES) || [];
    if (!query) return medicines;
    
    const lowerQuery = query.toLowerCase();
    return medicines.filter(medicine => 
      medicine.name.toLowerCase().includes(lowerQuery) || 
      medicine.category.toLowerCase().includes(lowerQuery)
    );
  }
};

// Stock Service
export const stockService = {
  // Add stock
  addStock: (medicineId, quantity, notes = '') => {
    // Update medicine quantity
    const medicine = medicineService.getById(medicineId);
    if (!medicine) return null;
    
    const updatedMedicine = {
      ...medicine,
      quantity: (medicine.quantity || 0) + quantity,
    };
    medicineService.update(medicineId, updatedMedicine);
    
    // Record stock history
    const stockHistory = getData(KEYS.STOCK_HISTORY) || [];
    const stockEntry = {
      id: generateId(),
      medicineId,
      medicineName: medicine.name,
      type: 'add',
      quantity,
      previousQuantity: medicine.quantity || 0,
      newQuantity: updatedMedicine.quantity,
      notes,
      timestamp: new Date().toISOString(),
    };
    stockHistory.push(stockEntry);
    saveData(KEYS.STOCK_HISTORY, stockHistory);
    
    return stockEntry;
  },
  
  // Reduce stock
  reduceStock: (medicineId, quantity, notes = '') => {
    // Update medicine quantity
    const medicine = medicineService.getById(medicineId);
    if (!medicine || (medicine.quantity || 0) < quantity) return null;
    
    const updatedMedicine = {
      ...medicine,
      quantity: (medicine.quantity || 0) - quantity,
    };
    medicineService.update(medicineId, updatedMedicine);
    
    // Record stock history
    const stockHistory = getData(KEYS.STOCK_HISTORY) || [];
    const stockEntry = {
      id: generateId(),
      medicineId,
      medicineName: medicine.name,
      type: 'reduce',
      quantity,
      previousQuantity: medicine.quantity || 0,
      newQuantity: updatedMedicine.quantity,
      notes,
      timestamp: new Date().toISOString(),
    };
    stockHistory.push(stockEntry);
    saveData(KEYS.STOCK_HISTORY, stockHistory);
    
    return stockEntry;
  },
  
  // Get stock history
  getStockHistory: (medicineId = null) => {
    const stockHistory = getData(KEYS.STOCK_HISTORY) || [];
    if (medicineId) {
      return stockHistory.filter(entry => entry.medicineId === medicineId);
    }
    return stockHistory;
  }
};

// Sales Service
export const salesService = {
  // Record a sale
  recordSale: (sale) => {
    // Reduce stock
    const medicine = medicineService.getById(sale.medicineId);
    if (!medicine || (medicine.quantity || 0) < sale.quantity) return null;
    
    stockService.reduceStock(
      sale.medicineId, 
      sale.quantity, 
      `Sale: ${sale.quantity} units`
    );
    
    // Record sale
    const sales = getData(KEYS.SALES) || [];
    const newSale = {
      ...sale,
      id: generateId(),
      medicineName: medicine.name,
      medicinePrice: medicine.sellingPrice,
      totalAmount: medicine.sellingPrice * sale.quantity,
      timestamp: new Date().toISOString(),
    };
    sales.push(newSale);
    saveData(KEYS.SALES, sales);
    
    return newSale;
  },
  
  // Get all sales
  getAllSales: () => {
    return getData(KEYS.SALES) || [];
  },
  
  // Get sales by date range
  getSalesByDateRange: (startDate, endDate) => {
    const sales = getData(KEYS.SALES) || [];
    return sales.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  },
  
  // Get monthly sales data
  getMonthlySalesData: () => {
    const sales = getData(KEYS.SALES) || [];
    const monthlySales = {};
    
    sales.forEach(sale => {
      const date = new Date(sale.timestamp);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlySales[monthYear]) {
        monthlySales[monthYear] = {
          month: monthYear,
          totalSales: 0,
          totalAmount: 0,
        };
      }
      
      monthlySales[monthYear].totalSales += sale.quantity;
      monthlySales[monthYear].totalAmount += sale.totalAmount;
    });
    
    return Object.values(monthlySales);
  },
  
  // Get top selling medicines
  getTopSellingMedicines: (limit = 5) => {
    const sales = getData(KEYS.SALES) || [];
    const medicineMap = {};
    
    sales.forEach(sale => {
      if (!medicineMap[sale.medicineId]) {
        medicineMap[sale.medicineId] = {
          medicineId: sale.medicineId,
          medicineName: sale.medicineName,
          totalQuantity: 0,
          totalAmount: 0,
        };
      }
      
      medicineMap[sale.medicineId].totalQuantity += sale.quantity;
      medicineMap[sale.medicineId].totalAmount += sale.totalAmount;
    });
    
    return Object.values(medicineMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }
};

// Alert Service
export const alertService = {
  // Get low stock alerts
  getLowStockAlerts: (threshold = 10) => {
    const medicines = medicineService.getAll();
    return medicines.filter(medicine => (medicine.quantity || 0) < threshold);
  },
  
  // Get expiring soon alerts
  getExpiringSoonAlerts: (days = 30) => {
    const medicines = medicineService.getAll();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return medicines.filter(medicine => {
      if (!medicine.expiryDate) return false;
      const expiryDate = new Date(medicine.expiryDate);
      return expiryDate <= futureDate && expiryDate >= today;
    });
  },
  
  // Get all alerts
  getAllAlerts: () => {
    return {
      lowStock: alertService.getLowStockAlerts(),
      expiringSoon: alertService.getExpiringSoonAlerts(),
    };
  }
};

import { medicineService, stockService, salesService } from './storageService';

// Check if data is already initialized
const isDataInitialized = () => {
  const medicines = medicineService.getAll();
  return medicines.length > 0;
};

// Generate random date within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Format date to ISO string (YYYY-MM-DD)
const formatDateToISO = (date) => {
  return date.toISOString().split('T')[0];
};

// Generate random number within a range
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Sample medicine data
const sampleMedicines = [
  {
    name: "Paracetamol 500mg",
    category: "Tablet",
    description: "Pain reliever and fever reducer",
    quantity: 150,
    purchasePrice: 0.5,
    sellingPrice: 1.2,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 12))))
  },
  {
    name: "Amoxicillin 250mg",
    category: "Capsule",
    description: "Antibiotic used to treat bacterial infections",
    quantity: 80,
    purchasePrice: 1.2,
    sellingPrice: 2.5,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 18))))
  },
  {
    name: "Ibuprofen 400mg",
    category: "Tablet",
    description: "Non-steroidal anti-inflammatory drug",
    quantity: 120,
    purchasePrice: 0.6,
    sellingPrice: 1.5,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 24))))
  },
  {
    name: "Cetirizine 10mg",
    category: "Tablet",
    description: "Antihistamine for allergy relief",
    quantity: 90,
    purchasePrice: 0.4,
    sellingPrice: 1.0,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 15))))
  },
  {
    name: "Omeprazole 20mg",
    category: "Capsule",
    description: "Proton pump inhibitor for acid reflux",
    quantity: 60,
    purchasePrice: 0.8,
    sellingPrice: 1.8,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 14))))
  },
  {
    name: "Metformin 500mg",
    category: "Tablet",
    description: "Oral diabetes medicine",
    quantity: 100,
    purchasePrice: 0.3,
    sellingPrice: 0.9,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 20))))
  },
  {
    name: "Azithromycin 250mg",
    category: "Tablet",
    description: "Antibiotic for bacterial infections",
    quantity: 40,
    purchasePrice: 1.5,
    sellingPrice: 3.0,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 10))))
  },
  {
    name: "Loratadine 10mg",
    category: "Tablet",
    description: "Antihistamine for allergy relief",
    quantity: 75,
    purchasePrice: 0.5,
    sellingPrice: 1.2,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 16))))
  },
  {
    name: "Aspirin 75mg",
    category: "Tablet",
    description: "Blood thinner and pain reliever",
    quantity: 200,
    purchasePrice: 0.2,
    sellingPrice: 0.6,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 22))))
  },
  {
    name: "Atorvastatin 10mg",
    category: "Tablet",
    description: "Cholesterol-lowering medication",
    quantity: 50,
    purchasePrice: 1.0,
    sellingPrice: 2.2,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 18))))
  },
  {
    name: "Cough Syrup",
    category: "Syrup",
    description: "For relief from cough and cold",
    quantity: 30,
    purchasePrice: 3.0,
    sellingPrice: 5.5,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 12))))
  },
  {
    name: "Vitamin C 500mg",
    category: "Tablet",
    description: "Dietary supplement",
    quantity: 150,
    purchasePrice: 0.3,
    sellingPrice: 0.8,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 24))))
  },
  {
    name: "Calcium + Vitamin D3",
    category: "Tablet",
    description: "Dietary supplement for bone health",
    quantity: 100,
    purchasePrice: 0.6,
    sellingPrice: 1.4,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 20))))
  },
  {
    name: "Diclofenac Gel",
    category: "Cream",
    description: "Topical pain reliever",
    quantity: 25,
    purchasePrice: 2.5,
    sellingPrice: 4.8,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 15))))
  },
  {
    name: "Ranitidine 150mg",
    category: "Tablet",
    description: "For acid reflux and heartburn",
    quantity: 70,
    purchasePrice: 0.7,
    sellingPrice: 1.6,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 14))))
  },
  {
    name: "Multivitamin",
    category: "Tablet",
    description: "Daily nutritional supplement",
    quantity: 120,
    purchasePrice: 0.4,
    sellingPrice: 1.0,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 18))))
  },
  {
    name: "Eye Drops",
    category: "Drop",
    description: "For dry eyes and irritation",
    quantity: 15,
    purchasePrice: 3.2,
    sellingPrice: 6.0,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 8))))
  },
  {
    name: "Antiseptic Solution",
    category: "Liquid",
    description: "For cleaning wounds",
    quantity: 20,
    purchasePrice: 2.0,
    sellingPrice: 3.8,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 24))))
  },
  {
    name: "Insulin",
    category: "Injection",
    description: "For diabetes management",
    quantity: 5,
    purchasePrice: 15.0,
    sellingPrice: 25.0,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 6))))
  },
  {
    name: "Bandages",
    category: "Other",
    description: "For wound dressing",
    quantity: 50,
    purchasePrice: 0.5,
    sellingPrice: 1.2,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 36))))
  },
  {
    name: "Levothyroxine 50mcg",
    category: "Tablet",
    description: "Thyroid hormone medication",
    quantity: 8,
    purchasePrice: 0.9,
    sellingPrice: 2.0,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 12))))
  },
  {
    name: "Amlodipine 5mg",
    category: "Tablet",
    description: "Blood pressure medication",
    quantity: 45,
    purchasePrice: 0.8,
    sellingPrice: 1.7,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 15))))
  },
  {
    name: "Metronidazole 400mg",
    category: "Tablet",
    description: "Antibiotic for bacterial infections",
    quantity: 35,
    purchasePrice: 0.7,
    sellingPrice: 1.5,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 9))))
  },
  {
    name: "Folic Acid 5mg",
    category: "Tablet",
    description: "Vitamin B supplement",
    quantity: 90,
    purchasePrice: 0.2,
    sellingPrice: 0.5,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 24))))
  },
  {
    name: "Ciprofloxacin 500mg",
    category: "Tablet",
    description: "Antibiotic for bacterial infections",
    quantity: 7,
    purchasePrice: 1.2,
    sellingPrice: 2.4,
    expiryDate: formatDateToISO(randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 3))))
  }
];

// Generate stock history
const generateStockHistory = (medicines) => {
  // For each medicine, generate some random stock operations
  medicines.forEach(medicine => {
    // Generate 1-3 stock operations per medicine
    const operationsCount = randomNumber(1, 3);
    
    for (let i = 0; i < operationsCount; i++) {
      const isAddOperation = Math.random() > 0.3; // 70% chance of add operation
      const quantity = randomNumber(5, 30);
      const daysAgo = randomNumber(1, 60);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      if (isAddOperation) {
        stockService.addStock(
          medicine.id,
          quantity,
          `Initial stock addition`
        );
      } else if (medicine.quantity > quantity) {
        // Only reduce if there's enough stock
        stockService.reduceStock(
          medicine.id,
          quantity,
          `Stock adjustment`
        );
      }
    }
  });
};

// Generate sales data
const generateSalesData = (medicines) => {
  // Generate 30-50 random sales
  const salesCount = randomNumber(30, 50);
  
  for (let i = 0; i < salesCount; i++) {
    // Pick a random medicine
    const medicineIndex = randomNumber(0, medicines.length - 1);
    const medicine = medicines[medicineIndex];
    
    // Generate random quantity (1-5)
    const quantity = randomNumber(1, 5);
    
    // Only create sale if there's enough stock
    if (medicine.quantity >= quantity) {
      // Generate random date in the past 90 days
      const daysAgo = randomNumber(1, 90);
      const saleDate = new Date();
      saleDate.setDate(saleDate.getDate() - daysAgo);
      
      // Record the sale
      salesService.recordSale({
        medicineId: medicine.id,
        quantity: quantity,
        date: formatDateToISO(saleDate),
        customerName: `Customer ${randomNumber(1, 20)}`,
        notes: Math.random() > 0.7 ? `Prescription #${randomNumber(1000, 9999)}` : ''
      });
    }
  }
};

// Initialize data
export const initializeDummyData = () => {
  if (isDataInitialized()) {
    console.log('Data already initialized');
    return false;
  }
  
  // Add medicines
  const addedMedicines = [];
  sampleMedicines.forEach(medicine => {
    const addedMedicine = medicineService.add(medicine);
    addedMedicines.push(addedMedicine);
  });
  
  // Generate stock history
  generateStockHistory(addedMedicines);
  
  // Generate sales data
  generateSalesData(addedMedicines);
  
  console.log('Dummy data initialized successfully');
  return true;
};

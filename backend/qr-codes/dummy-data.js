/**
 * Dummy QR Code Data for Testing
 * 
 * This file contains sample QR code data that can be used to test
 * the Nutech Warehouse System without actual QR codes.
 * 
 * HOW TO USE:
 * 1. During testing, use the "Manual Input" option in the QR scanner
 * 2. Copy and paste the JSON data below
 * 3. The system will treat it as if you scanned a real QR code
 */

// Sample Product QR Codes
const SAMPLE_PRODUCTS = [
  {
    productId: "P001",
    name: "RFID Scanner",
    manufactureDate: "2026-01-10",
    manufacturer: "Nutech Industries",
    location: "Chennai"
  },
  {
    productId: "P002",
    name: "Barcode Reader",
    manufactureDate: "2026-01-15",
    manufacturer: "TechCorp",
    location: "Mumbai"
  },
  {
    productId: "P003",
    name: "Wireless Label Printer",
    manufactureDate: "2026-02-01",
    manufacturer: "PrintTech Solutions",
    location: "Bangalore"
  },
  {
    productId: "P004",
    name: "Inventory Tablet",
    manufactureDate: "2026-02-10",
    manufacturer: "Nutech Industries",
    location: "Chennai"
  },
  {
    productId: "P005",
    name: "Forklift Camera",
    manufactureDate: "2026-02-20",
    manufacturer: "SafeVision",
    location: "Delhi"
  },
  {
    productId: "P006",
    name: "Temperature Sensor",
    manufactureDate: "2026-03-05",
    manufacturer: "EnviroTech",
    location: "Hyderabad"
  }
];

// Sample Rack QR Codes
const SAMPLE_RACKS = [
  {
    rackId: "RACK1",
    name: "Electronics Storage A"
  },
  {
    rackId: "RACK2",
    name: "Electronics Storage B"
  },
  {
    rackId: "RACK3",
    name: "Peripherals Zone"
  },
  {
    rackId: "RACK4",
    name: "Heavy Equipment"
  },
  {
    rackId: "RACK5",
    name: "Climate Controlled"
  }
];

// Export functions to get formatted JSON strings
function getProductQR(productId) {
  const product = SAMPLE_PRODUCTS.find(p => p.productId === productId);
  if (!product) return null;
  return JSON.stringify(product);
}

function getRackQR(rackId) {
  const rack = SAMPLE_RACKS.find(r => r.rackId === rackId);
  if (!rack) return null;
  return JSON.stringify(rack);
}

function getAllProducts() {
  return SAMPLE_PRODUCTS.map(p => ({
    ...p,
    json: JSON.stringify(p)
  }));
}

function getAllRacks() {
  return SAMPLE_RACKS.map(r => ({
    ...r,
    json: JSON.stringify(r)
  }));
}

// Print all sample data (for console use)
function printAllSamples() {
  console.log("=== NUTECH WAREHOUSE - SAMPLE QR DATA ===\n");
  
  console.log("📦 PRODUCT QR CODES:\n");
  SAMPLE_PRODUCTS.forEach(p => {
    console.log(`Product: ${p.name} (${p.productId})`);
    console.log(JSON.stringify(p));
    console.log("");
  });
  
  console.log("📍 RACK QR CODES:\n");
  SAMPLE_RACKS.forEach(r => {
    console.log(`Rack: ${r.name} (${r.rackId})`);
    console.log(JSON.stringify(r));
    console.log("");
  });
}

module.exports = {
  SAMPLE_PRODUCTS,
  SAMPLE_RACKS,
  getProductQR,
  getRackQR,
  getAllProducts,
  getAllRacks,
  printAllSamples
};

// If run directly, print samples
if (require.main === module) {
  printAllSamples();
}

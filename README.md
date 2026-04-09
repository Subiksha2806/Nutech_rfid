# 🏭 Nutech Warehouse Inventory Management System

A complete web application for managing warehouse inventory using QR codes. Built with React.js, Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [QR Code Format](#qr-code-format)
- [Screenshots](#screenshots)

## ✨ Features

### Core Modules

1. **Add Product**
   - Scan product QR code to extract details
   - Scan rack QR code to assign storage location
   - Store product with full traceability

2. **Move Product**
   - Scan product to view current location
   - Scan new rack to move product
   - Track movement history

3. **Dispatch Product**
   - Scan rack to view all stored products
   - Select or scan product for dispatch
   - Mark products as dispatched and remove from rack

### Bonus Features

- 📊 View all products in table format
- 🔍 Search and filter products
- 📈 Statistics dashboard
- 📜 Movement history log
- 📱 Camera-based QR scanning
- ⌨️ Manual QR input for testing

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **html5-qrcode** - QR code scanning
- **CSS3** - Styling with modern design

## 📁 Project Structure

```
nutech-warehouse/
├── backend/
│   ├── models/
│   │   ├── Product.js      # Product schema
│   │   ├── Rack.js         # Rack schema
│   │   └── Movement.js     # Movement history schema
│   ├── routes/
│   │   ├── products.js     # Product API routes
│   │   └── racks.js        # Rack API routes
│   ├── qr-codes/
│   │   └── dummy-data.js   # Sample QR data
│   ├── server.js           # Main server file
│   ├── seed.js             # Database seeder
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js       # Main navigation
│   │   │   ├── AddProduct.js      # Add product module
│   │   │   ├── MoveProduct.js     # Move product module
│   │   │   ├── DispatchProduct.js # Dispatch module
│   │   │   ├── ProductList.js     # Product inventory view
│   │   │   └── QRScanner.js       # QR scanner component
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── styles/
│   │   │   └── App.css            # All styles
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # Entry point
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone and Navigate
```bash
cd nutech-warehouse
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment
Edit `.env` file in the backend folder:
```env
MONGODB_URI=mongodb://localhost:27017/nutech-warehouse
PORT=5000
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutech-warehouse
```

### Step 4: Seed Database (Optional)
```bash
npm run seed
```

### Step 5: Start Backend Server
```bash
npm start
# OR for development with auto-reload:
npm run dev
```

Server will start at: `http://localhost:5000`

### Step 6: Install Frontend Dependencies
Open a new terminal:
```bash
cd frontend
npm install
```

### Step 7: Start Frontend
```bash
npm start
```

Frontend will start at: `http://localhost:3000`

## 📱 Usage Guide

### Testing with Sample QR Codes

The system includes manual QR input for testing. Sample data is shown on the dashboard:

**Product QR Example:**
```json
{
  "productId": "P001",
  "name": "RFID Scanner",
  "manufactureDate": "2026-01-10",
  "manufacturer": "Nutech Industries",
  "location": "Chennai"
}
```

**Rack QR Example:**
```json
{
  "rackId": "RACK1"
}
```

### Workflow Examples

#### Add a Product
1. Click "Add Product" on dashboard
2. Click "Use Manual Input Instead" (or use camera)
3. Paste product JSON and submit
4. Scan/enter rack JSON (e.g., `{"rackId":"RACK1"}`)
5. Click "Confirm & Save"

#### Move a Product
1. Click "Move Product"
2. Scan/enter product QR
3. System shows current rack
4. Scan/enter new rack QR
5. Confirm move

#### Dispatch a Product
1. Click "Dispatch Product"
2. Scan/enter rack QR
3. Select product from list OR scan product QR
4. Click "Confirm Dispatch"

## 🔌 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:productId` | Get single product |
| POST | `/api/products` | Add new product |
| PUT | `/api/products/:productId/move` | Move product to new rack |
| PUT | `/api/products/:productId/dispatch` | Dispatch product |

### Racks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/racks` | Get all racks |
| GET | `/api/racks/:rackId` | Get rack with products |
| POST | `/api/racks` | Create new rack |

### Movements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/racks/movements/all` | Get movement history |

## 📷 QR Code Format

### Product QR Code Structure
```json
{
  "productId": "Unique identifier (e.g., P001)",
  "name": "Product name",
  "manufactureDate": "YYYY-MM-DD",
  "manufacturer": "Manufacturer name",
  "location": "Manufacturing location"
}
```

### Rack QR Code Structure
```json
{
  "rackId": "Unique rack identifier (e.g., RACK1)"
}
```

## 📊 Database Schema

### Product Collection
```javascript
{
  productId: String (unique),
  name: String,
  manufactureDate: Date,
  manufacturer: String,
  location: String,
  rackId: String (nullable),
  status: Enum ['stored', 'dispatched', 'in_transit'],
  createdAt: Date,
  updatedAt: Date
}
```

### Movement Collection
```javascript
{
  productId: String,
  productName: String,
  fromRackId: String (nullable),
  toRackId: String,
  action: Enum ['added', 'moved', 'dispatched'],
  timestamp: Date,
  performedBy: String
}
```

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Progressive Steps** - Visual step indicators for each module
- **Real-time Feedback** - Success/error messages
- **Statistics Dashboard** - Quick overview of inventory status
- **Tabbed Interface** - Products view with history log
- **Search & Filter** - Find products quickly

## 🔧 Troubleshooting

### Camera Access Issues
If camera scanning doesn't work:
1. Use "Manual Input Instead" button
2. Paste the sample JSON data provided

### MongoDB Connection Issues
1. Ensure MongoDB is running locally
2. Check MONGODB_URI in `.env` file
3. For MongoDB Atlas, whitelist your IP address

### CORS Errors
The frontend proxy is configured in `package.json`. If issues persist:
1. Ensure backend is running on port 5000
2. Check `proxy` setting in frontend/package.json

## 📝 License

MIT License - Nutech Industries

## 👨‍💻 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start    # Uses react-scripts
```

---

Built with ❤️ for Nutech Industries

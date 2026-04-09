import React, { useState } from 'react';
import QRScanner from './QRScanner';
import { productAPI } from '../services/api';

/**
 * Add Product Module
 * Workflow:
 * 1. Scan Product QR code
 * 2. Display product details
 * 3. Scan Rack QR code
 * 4. Assign product to rack
 */
function AddProduct({ onBack }) {
  const [step, setStep] = useState(1); // 1: Scan Product, 2: Scan Rack, 3: Confirm
  const [productData, setProductData] = useState(null);
  const [rackId, setRackId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Handle product QR scan
  const handleProductScan = (data) => {
    if (data.productId) {
      setProductData(data);
      setStep(2);
      setError('');
    } else {
      setError('Invalid product QR code. Please scan a valid product.');
    }
  };

  // Step 2: Handle rack QR scan
  const handleRackScan = (data) => {
    if (data.rackId) {
      setRackId(data.rackId);
      setStep(3);
      setError('');
    } else {
      setError('Invalid rack QR code. Please scan a valid rack.');
    }
  };

  // Step 3: Save product to database
  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await productAPI.add({
        productId: productData.productId,
        name: productData.name,
        manufactureDate: productData.manufactureDate,
        manufacturer: productData.manufacturer,
        location: productData.location,
        rackId: rackId
      });

      setMessage(response.message);
      setStep(4); // Success step
    } catch (err) {
      setError(err.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset and add another product
  const handleReset = () => {
    setStep(1);
    setProductData(null);
    setRackId(null);
    setMessage('');
    setError('');
  };

  return (
    <div className="module-container">
      <h2>➕ Add Product to Warehouse</h2>
      
      {/* Progress Indicator */}
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Scan Product</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Scan Rack</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Confirm</div>
      </div>

      {/* Error Message */}
      {error && <div className="alert error">{error}</div>}

      {/* Step 1: Scan Product */}
      {step === 1 && (
        <div className="scan-step">
          <h3>Step 1: Scan Product QR Code</h3>
          <p>Please scan the QR code on the product to extract its details.</p>
          <QRScanner 
            onScan={handleProductScan} 
            onError={setError}
            placeholder="Scan product QR code..."
          />
        </div>
      )}

      {/* Step 2: Scan Rack */}
      {step === 2 && (
        <div className="scan-step">
          <h3>Step 2: Scan Rack QR Code</h3>
          <div className="product-preview">
            <h4>Product Details:</h4>
            <p><strong>ID:</strong> {productData.productId}</p>
            <p><strong>Name:</strong> {productData.name}</p>
            <p><strong>Manufacturer:</strong> {productData.manufacturer}</p>
            <p><strong>Manufacture Date:</strong> {productData.manufactureDate}</p>
            <p><strong>Location:</strong> {productData.location}</p>
          </div>
          <p>Now scan the QR code on the rack where you want to store this product.</p>
          <QRScanner 
            onScan={handleRackScan} 
            onError={setError}
            placeholder="Scan rack QR code..."
          />
          <button className="btn-secondary" onClick={() => setStep(1)}>
            ← Back to Product Scan
          </button>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="confirm-step">
          <h3>Step 3: Confirm Assignment</h3>
          <div className="confirmation-card">
            <h4>Product:</h4>
            <p><strong>{productData.name}</strong> ({productData.productId})</p>
            <p>From: {productData.manufacturer}</p>
            
            <h4>Will be stored in:</h4>
            <p><strong>{rackId}</strong></p>
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn-primary" 
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Saving...' : '✓ Confirm & Save'}
            </button>
            <button className="btn-secondary" onClick={() => setStep(2)}>
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="success-step">
          <div className="alert success">
            <h3>✅ Success!</h3>
            <p>{message}</p>
          </div>
          <div className="action-buttons">
            <button className="btn-primary" onClick={handleReset}>
              ➕ Add Another Product
            </button>
            <button className="btn-secondary" onClick={onBack}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProduct;

import React, { useState } from 'react';
import QRScanner from './QRScanner';
import { productAPI } from '../services/api';

/**
 * Move Product Module
 * Workflow:
 * 1. Scan Product QR code
 * 2. System shows current rack
 * 3. Scan NEW Rack QR code
 * 4. Move product to new rack
 */
function MoveProduct({ onBack }) {
  const [step, setStep] = useState(1); // 1: Scan Product, 2: Scan New Rack, 3: Confirm
  const [productData, setProductData] = useState(null);
  const [currentRackId, setCurrentRackId] = useState(null);
  const [newRackId, setNewRackId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Handle product QR scan
  const handleProductScan = async (data) => {
    if (data.productId) {
      try {
        setLoading(true);
        // Fetch product details from server
        const response = await productAPI.getById(data.productId);
        const product = response.data;
        
        if (product.status === 'dispatched') {
          setError('This product has already been dispatched and cannot be moved.');
          setLoading(false);
          return;
        }

        setProductData(product);
        setCurrentRackId(product.rackId);
        setStep(2);
        setError('');
      } catch (err) {
        setError('Product not found in database. Please add it first using "Add Product".');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid product QR code. Please scan a valid product.');
    }
  };

  // Step 2: Handle new rack QR scan
  const handleNewRackScan = (data) => {
    if (data.rackId) {
      if (data.rackId === currentRackId) {
        setError('New rack cannot be the same as current rack. Please scan a different rack.');
        return;
      }
      setNewRackId(data.rackId);
      setStep(3);
      setError('');
    } else {
      setError('Invalid rack QR code. Please scan a valid rack.');
    }
  };

  // Step 3: Move product
  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await productAPI.move(productData.productId, newRackId);
      setMessage(response.message);
      setStep(4); // Success step
    } catch (err) {
      setError(err.message || 'Failed to move product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset and move another product
  const handleReset = () => {
    setStep(1);
    setProductData(null);
    setCurrentRackId(null);
    setNewRackId(null);
    setMessage('');
    setError('');
  };

  return (
    <div className="module-container">
      <h2>🔄 Move Product</h2>
      
      {/* Progress Indicator */}
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Scan Product</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Scan New Rack</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Confirm</div>
      </div>

      {/* Error Message */}
      {error && <div className="alert error">{error}</div>}

      {/* Step 1: Scan Product */}
      {step === 1 && (
        <div className="scan-step">
          <h3>Step 1: Scan Product QR Code</h3>
          <p>Scan the product you want to move to a different rack.</p>
          <QRScanner 
            onScan={handleProductScan} 
            onError={setError}
            placeholder="Scan product QR code..."
          />
          {loading && <p>Looking up product...</p>}
        </div>
      )}

      {/* Step 2: Scan New Rack */}
      {step === 2 && (
        <div className="scan-step">
          <h3>Step 2: Scan Destination Rack</h3>
          <div className="product-preview">
            <h4>Product Details:</h4>
            <p><strong>ID:</strong> {productData.productId}</p>
            <p><strong>Name:</strong> {productData.name}</p>
            <p><strong>Current Rack:</strong> {currentRackId || 'Not assigned'}</p>
          </div>
          <p>Scan the QR code of the NEW rack where you want to move this product.</p>
          <QRScanner 
            onScan={handleNewRackScan} 
            onError={setError}
            placeholder="Scan new rack QR code..."
          />
          <button className="btn-secondary" onClick={() => setStep(1)}>
            ← Back to Product Scan
          </button>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="confirm-step">
          <h3>Step 3: Confirm Move</h3>
          <div className="confirmation-card">
            <h4>Product:</h4>
            <p><strong>{productData.name}</strong> ({productData.productId})</p>
            
            <div className="move-arrow">
              <p>From: <strong>{currentRackId}</strong></p>
              <div className="arrow">↓</div>
              <p>To: <strong>{newRackId}</strong></p>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn-primary" 
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Moving...' : '✓ Confirm Move'}
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
            <h3>✅ Move Successful!</h3>
            <p>{message}</p>
          </div>
          <div className="action-buttons">
            <button className="btn-primary" onClick={handleReset}>
              🔄 Move Another Product
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

export default MoveProduct;

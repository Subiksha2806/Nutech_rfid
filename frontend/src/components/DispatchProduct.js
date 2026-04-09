import React, { useState } from 'react';
import QRScanner from './QRScanner';
import { rackAPI, productAPI } from '../services/api';

/**
 * Dispatch Product Module
 * Workflow:
 * 1. Scan Rack QR code
 * 2. Show all products in that rack
 * 3. User selects product OR scans product QR
 * 4. Click "Dispatch" to remove product
 */
function DispatchProduct({ onBack }) {
  const [step, setStep] = useState(1); // 1: Scan Rack, 2: Select Product, 3: Confirm, 4: Success
  const [rackId, setRackId] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Handle rack QR scan
  const handleRackScan = async (data) => {
    if (data.rackId) {
      try {
        setLoading(true);
        // Fetch rack and products
        const response = await rackAPI.getById(data.rackId);
        const rackProducts = response.data.products || [];
        
        if (rackProducts.length === 0) {
          setError(`No products found in ${data.rackId}. Please scan a different rack.`);
          setLoading(false);
          return;
        }

        setRackId(data.rackId);
        setProducts(rackProducts);
        setStep(2);
        setError('');
      } catch (err) {
        setError('Failed to fetch rack data. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid rack QR code. Please scan a valid rack.');
    }
  };

  // Handle product selection from list
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setStep(3);
  };

  // Step 2 Alternative: Handle product QR scan directly
  const handleProductScan = async (data) => {
    if (data.productId) {
      try {
        setLoading(true);
        const response = await productAPI.getById(data.productId);
        const product = response.data;

        if (product.status === 'dispatched') {
          setError('This product has already been dispatched.');
          setLoading(false);
          return;
        }

        if (product.rackId !== rackId) {
          setError(`This product is in ${product.rackId}, not ${rackId}.`);
          setLoading(false);
          return;
        }

        setSelectedProduct(product);
        setStep(3);
        setError('');
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid product QR code.');
    }
  };

  // Step 3: Dispatch product
  const handleDispatch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await productAPI.dispatch(selectedProduct.productId);
      setMessage(response.message);
      setStep(4); // Success step
    } catch (err) {
      setError(err.message || 'Failed to dispatch product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset and dispatch another product
  const handleReset = () => {
    setStep(1);
    setRackId(null);
    setProducts([]);
    setSelectedProduct(null);
    setMessage('');
    setError('');
  };

  return (
    <div className="module-container">
      <h2>🚚 Dispatch Product</h2>
      
      {/* Progress Indicator */}
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Scan Rack</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Select Product</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Confirm</div>
      </div>

      {/* Error Message */}
      {error && <div className="alert error">{error}</div>}

      {/* Step 1: Scan Rack */}
      {step === 1 && (
        <div className="scan-step">
          <h3>Step 1: Scan Rack QR Code</h3>
          <p>Scan the rack containing the product you want to dispatch.</p>
          <QRScanner 
            onScan={handleRackScan} 
            onError={setError}
            placeholder="Scan rack QR code..."
          />
          {loading && <p>Loading rack data...</p>}
        </div>
      )}

      {/* Step 2: Select Product */}
      {step === 2 && (
        <div className="select-step">
          <h3>Step 2: Select Product to Dispatch</h3>
          <p><strong>Rack:</strong> {rackId}</p>
          
          <div className="products-list">
            <h4>Products in this rack:</h4>
            <div className="product-grid">
              {products.map((product) => (
                <div 
                  key={product.productId}
                  className="product-card"
                  onClick={() => handleProductSelect(product)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleProductSelect(product);
                    }
                  }}
                >
                  <h5>{product.name}</h5>
                  <p>ID: {product.productId}</p>
                  <p>{product.manufacturer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="or-divider">OR</div>

          <div className="scan-product-direct">
            <h4>Scan Product QR Directly:</h4>
            <QRScanner 
              onScan={handleProductScan} 
              onError={setError}
              placeholder="Scan product QR code..."
            />
          </div>

          <button className="btn-secondary" onClick={() => setStep(1)}>
            ← Back to Rack Scan
          </button>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="confirm-step">
          <h3>Step 3: Confirm Dispatch</h3>
          <div className="confirmation-card">
            <h4>Product to Dispatch:</h4>
            <p><strong>Name:</strong> {selectedProduct.name}</p>
            <p><strong>ID:</strong> {selectedProduct.productId}</p>
            <p><strong>Manufacturer:</strong> {selectedProduct.manufacturer}</p>
            <p><strong>Current Rack:</strong> {selectedProduct.rackId}</p>
            
            <div className="dispatch-warning">
              ⚠️ This will mark the product as dispatched and remove it from the rack.
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn-danger" 
              onClick={handleDispatch}
              disabled={loading}
            >
              {loading ? 'Dispatching...' : '🚚 Confirm Dispatch'}
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
            <h3>✅ Product Dispatched!</h3>
            <p>{message}</p>
            <p><strong>{selectedProduct.name}</strong> has been successfully dispatched.</p>
          </div>
          <div className="action-buttons">
            <button className="btn-primary" onClick={handleReset}>
              🚚 Dispatch Another Product
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

export default DispatchProduct;

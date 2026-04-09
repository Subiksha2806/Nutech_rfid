import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

/**
 * QR Code Display Component
 * Generates and displays professional QR codes for products
 */
function QRCodeDisplay({ product, onClose, onDownload }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, [product]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      
      // Create QR data for the product
      const qrData = {
        productId: product.productId,
        name: product.name,
        manufactureDate: product.manufactureDate,
        manufacturer: product.manufacturer,
        location: product.location
      };

      // Generate QR code with professional options
      const qrOptions = {
        width: 256,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      };

      const url = await QRCode.toDataURL(JSON.stringify(qrData), qrOptions);
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `${product.productId}_QR.png`;
      link.href = qrCodeUrl;
      link.click();
      
      if (onDownload) {
        onDownload(product);
      }
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${product.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              display: inline-block;
              padding: 20px;
              border: 2px solid #333;
              border-radius: 10px;
              background: white;
            }
            .qr-image {
              margin-bottom: 15px;
            }
            .product-info {
              font-size: 14px;
              color: #333;
            }
            .product-name {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 5px;
            }
            .product-id {
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-image" />
            <div class="product-info">
              <div class="product-name">${product.name}</div>
              <div class="product-id">ID: ${product.productId}</div>
              <div>${product.manufacturer}</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="qr-modal-overlay">
        <div className="qr-modal">
          <div className="qr-loading">
            <div className="spinner"></div>
            <p>Generating QR Code...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-modal-overlay">
      <div className="qr-modal">
        <div className="qr-modal-header">
          <h3>Product QR Code</h3>
          <button className="qr-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="qr-modal-content">
          <div className="qr-code-container">
            <img src={qrCodeUrl} alt="Product QR Code" className="qr-code-image" />
          </div>
          
          <div className="qr-product-details">
            <h4>{product.name}</h4>
            <p><strong>Product ID:</strong> {product.productId}</p>
            <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
            <p><strong>Location:</strong> {product.location}</p>
            <p><strong>Manufacture Date:</strong> {new Date(product.manufactureDate).toLocaleDateString()}</p>
            {product.rackId && <p><strong>Current Rack:</strong> {product.rackId}</p>}
          </div>
        </div>
        
        <div className="qr-modal-actions">
          <button className="qr-btn qr-btn-primary" onClick={handleDownload}>
            📥 Download QR Code
          </button>
          <button className="qr-btn qr-btn-secondary" onClick={handlePrint}>
            🖨️ Print QR Code
          </button>
          <button className="qr-btn qr-btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodeDisplay;

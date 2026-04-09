import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * QR Scanner Component
 * Uses html5-qrcode library for camera-based QR scanning
 * Also supports manual JSON input for testing
 */
function QRScanner({ onScan, onError, scanning = true, placeholder = "Scan QR code..." }) {
  const scannerRef = useRef(null);
  const [manualInput, setManualInput] = useState('');
  const [useManual, setUseManual] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let html5QrCode = null;

    if (scanning && !useManual && scannerRef.current) {
      html5QrCode = new Html5Qrcode("qr-reader");

      // Mobile-optimized configuration
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const config = {
        fps: isMobile ? 15 : 10,
        qrbox: isMobile ? { width: 200, height: 200 } : { width: 250, height: 250 },
        aspectRatio: 1.0,
        // Mobile-specific settings
        disableFlip: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      };

      // Try environment camera first (back camera on mobile)
      const startScanning = async () => {
        try {
          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              // Successfully scanned
              try {
                const data = JSON.parse(decodedText);
                onScan(data);
                html5QrCode.stop();
              } catch (e) {
                // If not JSON, pass as text
                onScan({ rawData: decodedText });
                html5QrCode.stop();
              }
            },
            (errorMessage) => {
              // QR scan error (this happens frequently while scanning)
              // Only report critical errors
              if (errorMessage && !errorMessage.includes('No QR code found')) {
                console.log('QR Scan:', errorMessage);
              }
            }
          );
          setIsScanning(true);
        } catch (err) {
          console.error('Environment camera failed, trying user camera:', err);
          try {
            // Fallback to user camera (front camera)
            await html5QrCode.start(
              { facingMode: "user" },
              config,
              (decodedText) => {
                try {
                  const data = JSON.parse(decodedText);
                  onScan(data);
                  html5QrCode.stop();
                } catch (e) {
                  onScan({ rawData: decodedText });
                  html5QrCode.stop();
                }
              },
              (errorMessage) => {
                if (errorMessage && !errorMessage.includes('No QR code found')) {
                  console.log('QR Scan:', errorMessage);
                }
              }
            );
            setIsScanning(true);
          } catch (fallbackErr) {
            console.error('All cameras failed:', fallbackErr);
            setUseManual(true);
            if (onError) onError('Camera access denied. Using manual input.');
          }
        }
      };

      startScanning();
    }

    return () => {
      if (html5QrCode && isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [scanning, useManual, onScan, onError, isScanning]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(manualInput);
      onScan(data);
      setManualInput('');
    } catch (e) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  const fillSampleData = (type) => {
    const samples = {
      product1: '{"productId":"P001","name":"RFID Scanner","manufactureDate":"2026-01-10","manufacturer":"Nutech Industries","location":"Chennai"}',
      product2: '{"productId":"P002","name":"Barcode Reader","manufactureDate":"2026-01-15","manufacturer":"TechCorp","location":"Mumbai"}',
      rack1: '{"rackId":"RACK1"}',
      rack2: '{"rackId":"RACK2"}'
    };
    setManualInput(samples[type]);
  };

  return (
    <div className="qr-scanner">
      {!useManual ? (
        <>
          <div 
            id="qr-reader" 
            ref={scannerRef}
            style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
          ></div>
          <p className="scanner-hint">{placeholder}</p>
          <button 
            className="btn-toggle" 
            onClick={() => setUseManual(true)}
          >
            Use Manual Input Instead
          </button>
        </>
      ) : (
        <div className="manual-input">
          <h4>Manual QR Input</h4>
          <p>Paste JSON data or use sample buttons:</p>
          
          <div className="sample-buttons">
            <button type="button" onClick={() => fillSampleData('product1')}>
              Sample Product 1
            </button>
            <button type="button" onClick={() => fillSampleData('product2')}>
              Sample Product 2
            </button>
            <button type="button" onClick={() => fillSampleData('rack1')}>
              Sample Rack 1
            </button>
            <button type="button" onClick={() => fillSampleData('rack2')}>
              Sample Rack 2
            </button>
          </div>

          <form onSubmit={handleManualSubmit}>
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder='{"productId":"P001","name":"Product Name",...}'
              rows="4"
            />
            <button type="submit" className="btn-primary">
              Submit QR Data
            </button>
          </form>

          <button 
            className="btn-toggle" 
            onClick={() => setUseManual(false)}
          >
            Try Camera Scanner
          </button>
        </div>
      )}
    </div>
  );
}

export default QRScanner;

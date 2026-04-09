import React from 'react';

/**
 * Dashboard Component
 * Main navigation hub with 3 primary modules
 */
function Dashboard({ onNavigate }) {
  const modules = [
    {
      id: 'add',
      title: 'Add Product',
      icon: '➕',
      description: 'Scan product QR and assign to rack',
      color: '#4CAF50'
    },
    {
      id: 'move',
      title: 'Move Product',
      icon: '🔄',
      description: 'Move product between racks',
      color: '#2196F3'
    },
    {
      id: 'dispatch',
      title: 'Dispatch Product',
      icon: '🚚',
      description: 'Dispatch products from racks',
      color: '#FF9800'
    },
    {
      id: 'list',
      title: 'View Products',
      icon: '📋',
      description: 'View all products and history',
      color: '#9C27B0'
    }
  ];

  return (
    <div className="dashboard">
      <h2>Choose an Action</h2>
      <div className="dashboard-grid">
        {modules.map((module) => (
          <div
            key={module.id}
            className="dashboard-card"
            onClick={() => onNavigate(module.id)}
            style={{ borderColor: module.color }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onNavigate(module.id);
              }
            }}
          >
            <div className="card-icon" style={{ backgroundColor: module.color }}>
              {module.icon}
            </div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </div>
        ))}
      </div>
      
      <div className="qr-samples">
        <h3>📱 Test QR Codes</h3>
        <p>Use these sample QR codes to test the system:</p>
        <div className="qr-list">
          <div className="qr-item">
            <strong>Product P001:</strong>
            <code>{'{"productId":"P001","name":"RFID Scanner","manufactureDate":"2026-01-10","manufacturer":"Nutech Industries","location":"Chennai"}'}</code>
          </div>
          <div className="qr-item">
            <strong>Product P002:</strong>
            <code>{'{"productId":"P002","name":"Barcode Reader","manufactureDate":"2026-01-15","manufacturer":"TechCorp","location":"Mumbai"}'}</code>
          </div>
          <div className="qr-item">
            <strong>Rack QR:</strong>
            <code>{'{"rackId":"RACK1"}'}</code> or <code>{'{"rackId":"RACK2"}'}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

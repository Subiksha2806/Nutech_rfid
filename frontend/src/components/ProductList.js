import React, { useState, useEffect } from 'react';
import { productAPI, movementAPI } from '../services/api';

/**
 * Product List Component
 * Displays all products with search and filter
 * Bonus feature: Shows movement history
 */
function ProductList({ onBack }) {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'history'
  const [stats, setStats] = useState({ total: 0, stored: 0, dispatched: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, movementsRes] = await Promise.all([
        productAPI.getAll(),
        movementAPI.getAll()
      ]);

      const productsData = productsRes.data || [];
      setProducts(productsData);
      setMovements(movementsRes.data || []);

      // Calculate stats
      setStats({
        total: productsData.length,
        stored: productsData.filter(p => p.status === 'stored').length,
        dispatched: productsData.filter(p => p.status === 'dispatched').length
      });
    } catch (err) {
      setError('Failed to load data. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'stored': return '#4CAF50';
      case 'dispatched': return '#f44336';
      case 'in_transit': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <div className="module-container">
        <h2>📋 Product Inventory</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="module-container">
      <h2>📋 Product Inventory</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Products</h4>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card stored">
          <h4>In Storage</h4>
          <p className="stat-value">{stats.stored}</p>
        </div>
        <div className="stat-card dispatched">
          <h4>Dispatched</h4>
          <p className="stat-value">{stats.dispatched}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Movement History
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          {/* Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="stored">In Storage</option>
              <option value="dispatched">Dispatched</option>
            </select>
            <button onClick={loadData} className="btn-refresh">🔄 Refresh</button>
          </div>

          {/* Products Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Manufacturer</th>
                  <th>Rack</th>
                  <th>Status</th>
                  <th>Manufacture Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No products found</td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.productId}</td>
                      <td>{product.name}</td>
                      <td>{product.manufacturer}</td>
                      <td>{product.rackId || '-'}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(product.status) }}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td>{formatDate(product.manufactureDate)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Movement History Tab */}
      {activeTab === 'history' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Product</th>
                <th>Action</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">No movement history</td>
                </tr>
              ) : (
                movements.map((movement, index) => (
                  <tr key={index}>
                    <td>{formatDate(movement.timestamp)}</td>
                    <td>{movement.productName} ({movement.productId})</td>
                    <td>
                      <span className={`action-badge ${movement.action}`}>
                        {movement.action}
                      </span>
                    </td>
                    <td>{movement.fromRackId || '-'}</td>
                    <td>{movement.toRackId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn-secondary" onClick={onBack}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default ProductList;

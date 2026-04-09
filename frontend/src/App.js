import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';
import MoveProduct from './components/MoveProduct';
import DispatchProduct from './components/DispatchProduct';
import ProductList from './components/ProductList';
import './styles/App.css';

/**
 * Main App Component
 * Handles navigation between different modules
 */
function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'add':
        return <AddProduct onBack={() => setCurrentView('dashboard')} />;
      case 'move':
        return <MoveProduct onBack={() => setCurrentView('dashboard')} />;
      case 'dispatch':
        return <DispatchProduct onBack={() => setCurrentView('dashboard')} />;
      case 'list':
        return <ProductList onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏭 Nutech Warehouse System</h1>
        {currentView !== 'dashboard' && (
          <button className="btn-back" onClick={() => setCurrentView('dashboard')}>
            ← Back to Dashboard
          </button>
        )}
      </header>
      <main className="app-main">
        {renderView()}
      </main>
      <footer className="app-footer">
        <p>© 2026 Nutech Industries - QR-Based Inventory Management</p>
      </footer>
    </div>
  );
}

export default App;

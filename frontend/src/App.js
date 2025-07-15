import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import UnitSelection from './components/UnitSelection';
import ChecklistForm from './components/ChecklistForm';
import BottomNavigation from './components/BottomNavigation';

function App() {
  const [user, setUser] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentStep, setCurrentStep] = useState('login'); // login, unit-selection, checklist, success

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setCurrentStep('unit-selection');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentStep('unit-selection');
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setCurrentStep('checklist');
  };

  const handleChecklistComplete = () => {
    setCurrentStep('success');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setSelectedUnit(null);
    setCurrentStep('login');
  };

  const handleNewChecklist = () => {
    setSelectedUnit(null);
    setCurrentStep('unit-selection');
  };

  const handleNavigate = (step) => {
    if (step === 'login') {
      handleLogout();
    } else if (step === 'unit-selection') {
      setSelectedUnit(null);
      setCurrentStep('unit-selection');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      
      case 'unit-selection':
        return (
          <div className="app-content">
            <div className="mobile-header">
              <div className="header-content">
                <h1>¡Hola, {user?.name}! 👋</h1>
                <p className="header-subtitle">Selecciona una unidad para comenzar</p>
                <button onClick={handleLogout} className="logout-btn-mobile">
                  Cerrar Sesión
                </button>
              </div>
            </div>
            <UnitSelection onUnitSelect={handleUnitSelect} />
          </div>
        );
      
      case 'checklist':
        return (
          <div className="app-content">
            <div className="mobile-header">
              <div className="header-content">
                <h1>Checklist</h1>
                <p className="header-subtitle">
                  <span className="unit-code">{selectedUnit?.code}</span>
                  <span className="unit-details">{selectedUnit?.name} • Piso {selectedUnit?.floor}</span>
                </p>
                <button onClick={handleLogout} className="logout-btn-mobile">
                  Cerrar Sesión
                </button>
              </div>
            </div>
            <ChecklistForm 
              selectedUnit={selectedUnit} 
              onComplete={handleChecklistComplete} 
            />
          </div>
        );
      
      case 'success':
        return (
          <div className="success-container">
            <div className="success-card">
              <div className="success-icon">🎉</div>
              <h1>¡Checklist Completado!</h1>
              <p>El checklist para <strong>{selectedUnit?.code}</strong> ha sido guardado exitosamente.</p>
              <div className="success-details">
                <div className="detail-item">
                  <span className="detail-label">Unidad:</span>
                  <span className="detail-value">{selectedUnit?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Piso:</span>
                  <span className="detail-value">{selectedUnit?.floor}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Completado por:</span>
                  <span className="detail-value">{user?.name}</span>
                </div>
              </div>
              <div className="success-actions">
                <button onClick={handleNewChecklist} className="btn btn-primary">
                  Nuevo Checklist
                </button>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App">
      <main className="app-main">
        {renderCurrentStep()}
      </main>
      
      {/* Show bottom navigation on mobile for logged in users */}
      {user && (
        <BottomNavigation 
          currentStep={currentStep}
          onNavigate={handleNavigate}
          user={user}
          canGoBack={true}
        />
      )}
    </div>
  );
}

export default App;

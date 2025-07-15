import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import UnitSelection from './components/UnitSelection';
import ChecklistForm from './components/ChecklistForm';

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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      
      case 'unit-selection':
        return (
          <div>
            <div className="header">
              <h1>Bienvenido, {user?.name}</h1>
              <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
            </div>
            <UnitSelection onUnitSelect={handleUnitSelect} />
          </div>
        );
      
      case 'checklist':
        return (
          <div>
            <div className="header">
              <h1>Checklist - {selectedUnit?.code}</h1>
              <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
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
              <h1>¡Checklist Completado!</h1>
              <p>El checklist para {selectedUnit?.code} ha sido guardado exitosamente.</p>
              <div className="success-actions">
                <button onClick={handleNewChecklist} className="primary-btn">
                  Nuevo Checklist
                </button>
                <button onClick={handleLogout} className="secondary-btn">
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
      {renderCurrentStep()}
    </div>
  );
}

export default App;

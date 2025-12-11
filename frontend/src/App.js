import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import UnitSelection from './components/UnitSelection';
import ChecklistForm from './components/ChecklistForm';
import TemplateList from './components/TemplateList';
import TemplateForm from './components/TemplateForm';

import UnitManager from './components/UnitManager';
import ReportList from './components/ReportList';

function App() {
  const [user, setUser] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [currentStep, setCurrentStep] = useState('login'); // login, unit-selection, checklist, success, admin-templates, admin-template-form, admin-units, admin-reports
  const [editingTemplate, setEditingTemplate] = useState(null);

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

  // Admin Actions
  const handleOpenAdmin = () => {
    setCurrentStep('admin-templates');
  };

  const handleOpenUnits = () => {
    setCurrentStep('admin-units');
  };

  const handleOpenReports = () => {
    setCurrentStep('admin-reports');
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setCurrentStep('admin-template-form');
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setCurrentStep('admin-template-form');
  };

  const handleSaveTemplate = () => {
    setCurrentStep('admin-templates');
    setEditingTemplate(null);
  };

  const handleCancelTemplate = () => {
    setCurrentStep('admin-templates');
    setEditingTemplate(null);
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
              <div className="header-buttons">
                {user?.role === 'admin' && (
                  <>
                    <button onClick={handleOpenUnits} className="secondary-btn" style={{ marginRight: '10px' }}>
                      Propiedades
                    </button>
                    <button onClick={handleOpenReports} className="secondary-btn" style={{ marginRight: '10px' }}>
                      Reportes
                    </button>
                    <button onClick={handleOpenAdmin} className="secondary-btn" style={{ marginRight: '10px' }}>
                      Plantillas
                    </button>
                  </>
                )}
                <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
              </div>
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

      case 'admin-templates':
        return (
          <TemplateList
            onCreate={handleCreateTemplate}
            onEdit={handleEditTemplate}
            onBack={() => setCurrentStep('unit-selection')}
          />
        );

      case 'admin-template-form':
        return (
          <TemplateForm
            templateToEdit={editingTemplate}
            onSave={handleSaveTemplate}
            onCancel={handleCancelTemplate}
          />
        );

      case 'admin-units':
        return (
          <UnitManager
            onBack={() => setCurrentStep('unit-selection')}
          />
        );

      case 'admin-reports':
        return (
          <ReportList
            onBack={() => setCurrentStep('unit-selection')}
          />
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

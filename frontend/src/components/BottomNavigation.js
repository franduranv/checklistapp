import React from 'react';
import './BottomNavigation.css';

const BottomNavigation = ({ currentStep, onNavigate, user, canGoBack = false }) => {
  const getStepIcon = (step) => {
    switch (step) {
      case 'login':
        return '👤';
      case 'unit-selection':
        return '🏠';
      case 'checklist':
        return '📋';
      case 'success':
        return '✅';
      default:
        return '•';
    }
  };

  const getStepLabel = (step) => {
    switch (step) {
      case 'login':
        return 'Login';
      case 'unit-selection':
        return 'Unidades';
      case 'checklist':
        return 'Checklist';
      case 'success':
        return 'Completo';
      default:
        return '';
    }
  };

  const steps = ['login', 'unit-selection', 'checklist', 'success'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="bottom-navigation">
      <div className="bottom-nav-container">
        {/* Back Button */}
        {canGoBack && currentStep !== 'login' && (
          <button 
            className="nav-back-btn"
            onClick={() => {
              if (currentStep === 'unit-selection') {
                onNavigate('login');
              } else if (currentStep === 'checklist') {
                onNavigate('unit-selection');
              }
            }}
            aria-label="Volver atrás"
          >
            <span className="nav-icon">←</span>
            <span className="nav-label">Atrás</span>
          </button>
        )}

        {/* Progress Indicator */}
        <div className="nav-progress">
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`progress-step ${index <= currentIndex ? 'completed' : ''} ${step === currentStep ? 'current' : ''}`}
              >
                <div className="step-circle">
                  <span className="step-icon">{getStepIcon(step)}</span>
                </div>
                <span className="step-label">{getStepLabel(step)}</span>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="nav-user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-step">{getStepLabel(currentStep)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
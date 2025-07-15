import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UnitSelection.css';

const UnitSelection = ({ onUnitSelect }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/units', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUnits(response.data.data);
      }
    } catch (error) {
      setError('Error al cargar las unidades');
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitSelect = (unit) => {
    // Add haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    onUnitSelect(unit);
  };

  const handleKeyDown = (event, unit) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleUnitSelect(unit);
    }
  };

  const filteredUnits = selectedCategory === 'all' 
    ? units 
    : units.filter(unit => unit.category === selectedCategory);

  const getCategoryDisplayName = (category) => {
    switch (category) {
      case 'short-term':
        return 'Corto plazo';
      case 'long-term':
        return 'Renta fija';
      default:
        return 'Todas las unidades';
    }
  };

  if (loading) {
    return (
      <div className="unit-selection-container">
        <div className="loading" role="status" aria-label="Cargando unidades">
          Cargando unidades...
        </div>
      </div>
    );
  }

  return (
    <div className="unit-selection-container">
      <div className="unit-selection-card">
        <h2>Seleccionar Unidad</h2>
        
        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            {error}
          </div>
        )}
        
        <div className="category-filter">
          <label htmlFor="category-select">Filtrar por categoría:</label>
          <select 
            id="category-select"
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filtrar unidades por categoría"
          >
            <option value="all">Todas las unidades</option>
            <option value="short-term">Renta a corto plazo</option>
            <option value="long-term">Renta fija</option>
          </select>
        </div>
        
        <div 
          className="units-grid"
          role="grid"
          aria-label={`Lista de unidades - ${getCategoryDisplayName(selectedCategory)}`}
        >
          {filteredUnits.map((unit) => (
            <div 
              key={unit._id} 
              className="unit-card"
              onClick={() => handleUnitSelect(unit)}
              onKeyDown={(e) => handleKeyDown(e, unit)}
              role="button"
              tabIndex={0}
              aria-label={`Seleccionar unidad ${unit.code}, ${unit.name}, Piso ${unit.floor}, Categoría: ${getCategoryDisplayName(unit.category)}`}
            >
              <h3>{unit.code}</h3>
              <p className="unit-name">{unit.name}</p>
              <p className="unit-floor">Piso {unit.floor}</p>
              <span className={`unit-category ${unit.category}`}>
                {getCategoryDisplayName(unit.category)}
              </span>
            </div>
          ))}
        </div>
        
        {filteredUnits.length === 0 && (
          <div className="no-units" role="status">
            No hay unidades disponibles en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitSelection; 
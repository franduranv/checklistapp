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
    onUnitSelect(unit);
  };

  const filteredUnits = selectedCategory === 'all' 
    ? units 
    : units.filter(unit => unit.category === selectedCategory);

  if (loading) {
    return (
      <div className="unit-selection-container">
        <div className="loading">Cargando unidades...</div>
      </div>
    );
  }

  return (
    <div className="unit-selection-container">
      <div className="unit-selection-card">
        <h2>Seleccionar Unidad</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="category-filter">
          <label>Filtrar por categoría:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las unidades</option>
            <option value="short-term">Renta a corto plazo</option>
            <option value="long-term">Renta fija</option>
          </select>
        </div>
        
        <div className="units-grid">
          {filteredUnits.map((unit) => (
            <div 
              key={unit._id} 
              className="unit-card"
              onClick={() => handleUnitSelect(unit)}
            >
              <h3>{unit.code}</h3>
              <p className="unit-name">{unit.name}</p>
              <p className="unit-floor">Piso {unit.floor}</p>
              <span className={`unit-category ${unit.category}`}>
                {unit.category === 'short-term' ? 'Corto plazo' : 'Renta fija'}
              </span>
            </div>
          ))}
        </div>
        
        {filteredUnits.length === 0 && (
          <div className="no-units">
            No hay unidades disponibles en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitSelection; 
import React, { useState } from 'react';
import axios from 'axios';
import './ChecklistForm.css';

const ChecklistForm = ({ selectedUnit, onComplete }) => {
  const [formData, setFormData] = useState({
    items: {
      bathroom: false,
      kitchen: false,
      whites: false,
      livingRoom: false
    },
    photos: [],
    finalStatus: '',
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleItemChange = (item) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [item]: !prev.items[item]
      }
    }));
  };

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setFormData(prev => ({
          ...prev,
          photos: [
            ...prev.photos.filter(p => p.type !== type),
            {
              base64,
              type,
              description: `Foto ${type === 'before' ? 'antes' : type === 'after' ? 'después' : 'detalle'}`
            }
          ]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.finalStatus) {
      setError('Por favor selecciona el estado final');
      return;
    }

    if (formData.photos.length === 0) {
      setError('Por favor sube al menos una foto');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/checklists', {
        unitId: selectedUnit._id,
        items: formData.items,
        photos: formData.photos,
        finalStatus: formData.finalStatus,
        comments: formData.comments
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        onComplete();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar el checklist');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'clean-ready': return 'Limpio y Listo';
      case 'with-observations': return 'Con Observaciones';
      case 'not-ready': return 'No Listo';
      default: return '';
    }
  };

  return (
    <div className="checklist-form-container">
      <div className="checklist-form-card">
        <h2>Checklist de Limpieza</h2>
        <h3>{selectedUnit.code}</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h4>Áreas Revisadas</h4>
            <div className="items-grid">
              <label className="item-checkbox">
                <input
                  type="checkbox"
                  checked={formData.items.bathroom}
                  onChange={() => handleItemChange('bathroom')}
                />
                <span>Baño</span>
              </label>
              
              <label className="item-checkbox">
                <input
                  type="checkbox"
                  checked={formData.items.kitchen}
                  onChange={() => handleItemChange('kitchen')}
                />
                <span>Cocina</span>
              </label>
              
              <label className="item-checkbox">
                <input
                  type="checkbox"
                  checked={formData.items.whites}
                  onChange={() => handleItemChange('whites')}
                />
                <span>Blancos</span>
              </label>
              
              <label className="item-checkbox">
                <input
                  type="checkbox"
                  checked={formData.items.livingRoom}
                  onChange={() => handleItemChange('livingRoom')}
                />
                <span>Sala</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h4>Fotos (máximo 3)</h4>
            <div className="photos-grid">
              <div className="photo-upload">
                <label htmlFor="before-photo">Antes</label>
                <input
                  type="file"
                  id="before-photo"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'before')}
                />
                {formData.photos.find(p => p.type === 'before') && (
                  <div className="photo-preview">✓ Foto subida</div>
                )}
              </div>
              
              <div className="photo-upload">
                <label htmlFor="after-photo">Después</label>
                <input
                  type="file"
                  id="after-photo"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'after')}
                />
                {formData.photos.find(p => p.type === 'after') && (
                  <div className="photo-preview">✓ Foto subida</div>
                )}
              </div>
              
              <div className="photo-upload">
                <label htmlFor="detail-photo">Detalle</label>
                <input
                  type="file"
                  id="detail-photo"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'detail')}
                />
                {formData.photos.find(p => p.type === 'detail') && (
                  <div className="photo-preview">✓ Foto subida</div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Estado Final</h4>
            <div className="status-options">
              {['clean-ready', 'with-observations', 'not-ready'].map(status => (
                <label key={status} className="status-option">
                  <input
                    type="radio"
                    name="finalStatus"
                    value={status}
                    checked={formData.finalStatus === status}
                    onChange={(e) => setFormData(prev => ({ ...prev, finalStatus: e.target.value }))}
                  />
                  <span>{getStatusLabel(status)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h4>Comentarios Adicionales</h4>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Agrega comentarios adicionales si es necesario..."
              rows="4"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Checklist'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChecklistForm; 
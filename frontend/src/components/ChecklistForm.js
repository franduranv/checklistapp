import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChecklistForm.css';

const ChecklistForm = ({ selectedUnit, onComplete }) => {
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState([]); // Array of { areaName, itemText, value, comment }
  const [photos, setPhotos] = useState([]);
  const [finalStatus, setFinalStatus] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplate();
  }, [selectedUnit]);

  const fetchTemplate = async () => {
    try {
      // 1. Get Unit details to find the template
      // Ideally selectedUnit has it, but if not we might need to fetch unit again or just fetch the template directly if we know the ID.
      // For now, assuming selectedUnit might NOT have defaultTemplate populated if it came from a list that didn't populate it.
      // But let's check if selectedUnit.defaultTemplate exists.

      let templateId = selectedUnit.defaultTemplate;

      if (!templateId) {
        // Fallback: Fetch unit specifically to get populated template or just get the first template available (as a temporary measure)
        // OR better: Ask backend for the 'active' template for this unit.
        // For simplicity: Fetch all templates and pick the first one if unit doesn't have one (Fallback).
        const templatesRes = await axios.get('http://localhost:4000/api/templates');
        if (templatesRes.data.length > 0) {
          templateId = templatesRes.data[0]._id;
        } else {
          setError('No hay plantillas de checklist disponibles. Contacta al administrador.');
          setLoading(false);
          return;
        }
      }

      const response = await axios.get(`http://localhost:4000/api/templates/${templateId}`);
      setTemplate(response.data);

      // Initialize answers
      const initialAnswers = [];
      response.data.areas.forEach(area => {
        area.items.forEach(item => {
          initialAnswers.push({
            areaName: area.name,
            itemText: item.text,
            value: item.type === 'boolean' ? false : '', // Default value
            type: item.type,
            comment: ''
          });
        });
      });
      setAnswers(initialAnswers);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching template:', err);
      setError('Error al cargar el checklist.');
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].value = value;
    setAnswers(newAnswers);
  };

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setPhotos(prev => [
          ...prev.filter(p => p.type !== type),
          {
            base64,
            type,
            description: `Foto ${type === 'before' ? 'antes' : type === 'after' ? 'después' : 'detalle'}`
          }
        ]
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!finalStatus) {
      setError('Por favor selecciona el estado final');
      return;
    }

    if (photos.length === 0) {
      setError('Por favor sube al menos una foto');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      // Filter out internal fields like 'type' from answers if backend doesn't need them, 
      // but Schema expects { areaName, itemText, value, comment }
      const cleanAnswers = answers.map(({ areaName, itemText, value, comment }) => ({
        areaName,
        itemText,
        value,
        comment
      }));

      const response = await axios.post('http://localhost:4000/api/checklists', {
        unitId: selectedUnit._id,
        templateId: template._id,
        items: cleanAnswers,
        photos: photos,
        finalStatus: finalStatus,
        comments: comments
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        onComplete();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar el checklist');
    } finally {
      setSaving(false);
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

  if (loading) return <div>Cargando checklist...</div>;
  if (!template) return <div>No se encontró la plantilla.</div>;

  return (
    <div className="checklist-form-container">
      <div className="checklist-form-card">
        <h2>{template.name}</h2>
        <h3>{selectedUnit.code}</h3>
        <p className="template-desc">{template.description}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Dynamic Areas */}
          {template.areas.map((area, areaIndex) => (
            <div key={areaIndex} className="form-section">
              <h4>{area.name}</h4>
              <div className="items-grid">
                {/* We need to map global answers array to this area. 
                      Efficient way: Iterate answers and check areaName? 
                      Or just iterate template items and find index in answers? 
                      Since we initialized answers in order, we can calculate index or search.
                  */}
                {area.items.map((item, itemIndex) => {
                  // Find the corresponding answer in the flat array
                  // This is simple logic, could be optimized
                  const answerIndex = answers.findIndex(a => a.areaName === area.name && a.itemText === item.text);
                  if (answerIndex === -1) return null;

                  return (
                    <div key={itemIndex} className="dynamic-item">
                      {item.type === 'boolean' && (
                        <label className="item-checkbox">
                          <input
                            type="checkbox"
                            checked={answers[answerIndex].value === true}
                            onChange={(e) => handleAnswerChange(answerIndex, e.target.checked)}
                          />
                          <span>{item.text}</span>
                        </label>
                      )}
                      {item.type === 'text' && (
                        <div className="text-item">
                          <label>{item.text}</label>
                          <input
                            type="text"
                            value={answers[answerIndex].value}
                            onChange={(e) => handleAnswerChange(answerIndex, e.target.value)}
                            className="full-width-input"
                          />
                        </div>
                      )}
                      {/* Render Photo Item */}
                      {item.type === 'photo' && (
                        <div className="photo-item">
                          <label>{item.text}</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  // Store as object for backend to detect
                                  handleAnswerChange(answerIndex, {
                                    type: 'photo',
                                    base64: ev.target.result
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          {answers[answerIndex].value && answers[answerIndex].value.base64 && (
                            <div className="photo-preview-mini">✓ Foto seleccionada</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="form-section">
            <h4>Fotos Generales (máximo 3)</h4>
            <div className="photos-grid">
              <div className="photo-upload">
                <label htmlFor="before-photo">Antes</label>
                <input
                  type="file"
                  id="before-photo"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'before')}
                />
                {photos.find(p => p.type === 'before') && (
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
                {photos.find(p => p.type === 'after') && (
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
                {photos.find(p => p.type === 'detail') && (
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
                    checked={finalStatus === status}
                    onChange={(e) => setFinalStatus(e.target.value)}
                  />
                  <span>{getStatusLabel(status)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h4>Comentarios Adicionales</h4>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Agrega comentarios adicionales si es necesario..."
              rows="4"
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Checklist'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChecklistForm;
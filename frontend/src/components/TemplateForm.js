import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TemplateManager.css';

const TemplateForm = ({ templateToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        areas: []
    });

    useEffect(() => {
        if (templateToEdit) {
            setFormData(templateToEdit);
        } else {
            // Default state for new template
            setFormData({
                name: '',
                description: '',
                areas: [{ name: 'Nueva Área', items: [{ text: 'Nuevo Item', type: 'boolean' }] }]
            });
        }
    }, [templateToEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAreaChange = (index, value) => {
        const newAreas = [...formData.areas];
        newAreas[index].name = value;
        setFormData({ ...formData, areas: newAreas });
    };

    const addItem = (areaIndex) => {
        const newAreas = [...formData.areas];
        newAreas[areaIndex].items.push({ text: '', type: 'boolean' });
        setFormData({ ...formData, areas: newAreas });
    };

    const updateItem = (areaIndex, itemIndex, field, value) => {
        const newAreas = [...formData.areas];
        newAreas[areaIndex].items[itemIndex][field] = value;
        setFormData({ ...formData, areas: newAreas });
    };

    const removeItem = (areaIndex, itemIndex) => {
        const newAreas = [...formData.areas];
        newAreas[areaIndex].items.splice(itemIndex, 1);
        setFormData({ ...formData, areas: newAreas });
    };

    const addArea = () => {
        setFormData({
            ...formData,
            areas: [...formData.areas, { name: '', items: [] }]
        });
    };

    const removeArea = (index) => {
        const newAreas = [...formData.areas];
        newAreas.splice(index, 1);
        setFormData({ ...formData, areas: newAreas });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (templateToEdit) {
                await axios.put(`http://localhost:4000/api/templates/${templateToEdit._id}`, formData);
            } else {
                await axios.post('http://localhost:4000/api/templates', formData);
            }
            onSave();
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Error al guardar la plantilla');
        }
    };

    return (
        <div className="template-form-container">
            <h2>{templateToEdit ? 'Editar Plantilla' : 'Nueva Plantilla'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de la Plantilla</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="full-width-input"
                    />
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="full-width-input"
                    />
                </div>

                <h3>Áreas e Items</h3>
                {formData.areas.map((area, areaIndex) => (
                    <div key={areaIndex} className="area-section">
                        <div className="area-header item-row">
                            <input
                                type="text"
                                value={area.name}
                                onChange={(e) => handleAreaChange(areaIndex, e.target.value)}
                                placeholder="Nombre del Área (ej. Cocina)"
                                required
                            />
                            <button type="button" onClick={() => removeArea(areaIndex)} className="remove-btn" title="Eliminar Área">×</button>
                        </div>

                        <div className="items-list">
                            {area.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="item-row">
                                    <span>•</span>
                                    <input
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => updateItem(areaIndex, itemIndex, 'text', e.target.value)}
                                        placeholder="¿Qué revisar?"
                                        required
                                        style={{ flex: 1 }}
                                    />
                                    <select
                                        value={item.type}
                                        onChange={(e) => updateItem(areaIndex, itemIndex, 'type', e.target.value)}
                                    >
                                        <option value="boolean">Sí/No</option>
                                        <option value="text">Texto</option>
                                        <option value="photo">Foto</option>
                                    </select>
                                    <button type="button" onClick={() => removeItem(areaIndex, itemIndex)} className="remove-btn" title="Eliminar Item">×</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addItem(areaIndex)} className="small-btn">+ Agregar Item</button>
                        </div>
                    </div>
                ))}

                <button type="button" onClick={addArea} className="secondary-btn mb-20">+ Agregar Nueva Área</button>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="secondary-btn">Cancelar</button>
                    <button type="submit" className="primary-btn">Guardar Plantilla</button>
                </div>
            </form>
        </div>
    );
};

export default TemplateForm;

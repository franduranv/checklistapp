import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TemplateManager.css'; // Reusing similar styles

const UnitManager = ({ onBack }) => {
    const [units, setUnits] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        category: 'short-term',
        floor: 1,
        defaultTemplate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [unitsRes, templatesRes] = await Promise.all([
                axios.get('http://localhost:4000/api/units', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
                axios.get('http://localhost:4000/api/templates')
            ]);
            setUnits(unitsRes.data.data);
            setTemplates(templatesRes.data);
            if (templatesRes.data.length > 0) {
                setFormData(prev => ({ ...prev, defaultTemplate: templatesRes.data[0]._id }));
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar esta unidad?')) {
            try {
                await axios.delete(`http://localhost:4000/api/units/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                fetchData();
            } catch (error) {
                console.error('Error deleting unit:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/api/units', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setShowForm(false);
            setFormData({
                code: '',
                name: '',
                category: 'short-term',
                floor: 1,
                defaultTemplate: templates[0]?._id || ''
            });
            fetchData();
        } catch (error) {
            alert('Error creando unidad: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="template-list-container">
            <div className="header-actions">
                <h2>Gestión de Propiedades</h2>
                {!showForm && <button onClick={() => setShowForm(true)} className="primary-btn">Nueva Propiedad</button>}
            </div>

            {showForm && (
                <div className="template-card" style={{ marginBottom: '20px' }}>
                    <h3>Nueva Propiedad</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Código (ej. 101)</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                                required
                                className="full-width-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="full-width-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Piso</label>
                            <input
                                type="number"
                                value={formData.floor}
                                onChange={e => setFormData({ ...formData, floor: e.target.value })}
                                required
                                className="full-width-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Categoría</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="full-width-input"
                            >
                                <option value="short-term">Renta Corta (Airbnb)</option>
                                <option value="long-term">Renta Larga</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Plantilla por Defecto</label>
                            <select
                                value={formData.defaultTemplate}
                                onChange={e => setFormData({ ...formData, defaultTemplate: e.target.value })}
                                className="full-width-input"
                            >
                                {templates.map(t => (
                                    <option key={t._id} value={t._id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="card-actions">
                            <button type="submit" className="primary-btn">Guardar</button>
                            <button type="button" onClick={() => setShowForm(false)} className="secondary-btn">Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="template-grid">
                {units.map(unit => (
                    <div key={unit._id} className="template-card">
                        <h3>{unit.code} - {unit.name}</h3>
                        <p className="template-desc">Piso: {unit.floor} | {unit.category}</p>
                        <p className="template-desc" style={{ fontSize: '0.9em', color: '#666' }}>
                            Plantilla: {unit.defaultTemplate?.name || 'Ninguna'}
                        </p>
                        <div className="card-actions">
                            <button onClick={() => handleDelete(unit._id)} className="danger-btn">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onBack} className="back-link">Volver al Inicio</button>
        </div>
    );
};

export default UnitManager;

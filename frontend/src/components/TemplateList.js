import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TemplateManager.css';

const TemplateList = ({ onEdit, onCreate, onBack }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/templates');
            setTemplates(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
            try {
                await axios.delete(`http://localhost:4000/api/templates/${id}`);
                fetchTemplates();
            } catch (error) {
                console.error('Error deleting template:', error);
            }
        }
    };

    if (loading) return <div>Cargando plantillas...</div>;

    return (
        <div className="template-list-container">
            <div className="header-actions">
                <h2>Gestión de Plantillas</h2>
                <button onClick={onCreate} className="primary-btn">Nueva Plantilla</button>
            </div>

            <div className="template-grid">
                {templates.map(template => (
                    <div key={template._id} className="template-card">
                        <h3>{template.name}</h3>
                        <p>{template.description}</p>
                        <div className="template-stats">
                            <span>{template.areas.length} Áreas</span>
                        </div>
                        <div className="card-actions">
                            <button onClick={() => onEdit(template)} className="secondary-btn">Editar</button>
                            <button onClick={() => handleDelete(template._id)} className="danger-btn">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onBack} className="back-link">Volver al Inicio</button>
        </div>
    );
};

export default TemplateList;

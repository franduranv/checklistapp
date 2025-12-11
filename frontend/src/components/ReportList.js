import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TemplateManager.css'; // Reusing styles

const ReportList = ({ onBack }) => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/checklists', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setReports(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setLoading(false);
        }
    };

    const handleViewReport = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:4000/api/checklists/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSelectedReport(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching details:', error);
            setLoading(false);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'clean-ready': return 'Limpio y Listo';
            case 'with-observations': return 'Con Observaciones';
            case 'not-ready': return 'No Listo';
            default: return status;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) return <div>Cargando...</div>;

    if (selectedReport) {
        return (
            <div className="template-list-container">
                <h2>Detalle de Reporte</h2>
                <div className="template-card">
                    <h3>Unit: {selectedReport.unit?.code} - {selectedReport.unit?.name}</h3>
                    <p><strong>Operador:</strong> {selectedReport.user?.name}</p>
                    <p><strong>Fecha:</strong> {formatDate(selectedReport.createdAt)}</p>
                    <p><strong>Estado:</strong> {getStatusLabel(selectedReport.finalStatus)}</p>
                    <p><strong>Comentarios:</strong> {selectedReport.comments || 'Ninguno'}</p>

                    <h4>Respuestas</h4>
                    <div className="items-list">
                        {selectedReport.items.map((item, index) => (
                            <div key={index} className="item-row" style={{ display: 'block', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <strong>{item.itemText}</strong>:

                                {/* Logic to display value type */}
                                {/* If it's a photo (starts with http or is string) */}
                                {typeof item.value === 'string' && item.value.startsWith('http') ? (
                                    <div>
                                        <a href={item.value} target="_blank" rel="noopener noreferrer">Ver Foto</a>
                                        <br />
                                        <img src={item.value} alt="evidence" style={{ maxWidth: '200px', marginTop: '5px' }} />
                                    </div>
                                ) : (
                                    <span> {item.value === true ? 'Sí' : item.value === false ? 'No' : item.value}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <h4>Fotos Globales</h4>
                    <div className="photos-grid">
                        {selectedReport.photos.map((photo, index) => (
                            <div key={index} className="photo-preview" style={{ width: 'auto' }}>
                                <p>{photo.type}</p>
                                <a href={photo.url} target="_blank" rel="noopener noreferrer">
                                    <img src={photo.url} alt={photo.type} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="card-actions" style={{ marginTop: '20px' }}>
                        <button onClick={() => setSelectedReport(null)} className="secondary-btn">Volver a Lista</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="template-list-container">
            <div className="header-actions">
                <h2>Reportes de Limpieza</h2>
            </div>

            <div className="template-grid">
                {/* Using grid but maybe table is better for list. Let's stick to cards for consistency with UI */}
                {reports.length === 0 && <p>No hay reportes aún.</p>}
                {reports.map(report => (
                    <div key={report._id} className="template-card">
                        <h3>{report.unit?.code}</h3>
                        <p>{formatDate(report.createdAt)}</p>
                        <p><strong>Estado:</strong> {getStatusLabel(report.finalStatus)}</p>
                        <p>Operador: {report.user?.name}</p>
                        <div className="card-actions">
                            <button onClick={() => handleViewReport(report._id)} className="primary-btn">Ver Detalle</button>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onBack} className="back-link">Volver al Inicio</button>
        </div>
    );
};

export default ReportList;

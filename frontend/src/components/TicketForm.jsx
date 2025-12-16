import React, { useState } from 'react';
import { THEME } from '../theme';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  requesterName: '',
  status: 'OPEN',
  priority: 'LOW',
  category: '',
  estimatedCost: '',
  currency: 'USD',
  dueDate: '',
};

function TicketForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Validaciones básicas
    if (!form.requesterName.trim()) {
      setError('El nombre del solicitante es obligatorio'); setLoading(false); return;
    }
    if (!form.category.trim()) {
      setError('La categoría es obligatoria'); setLoading(false); return;
    }
    if (!form.estimatedCost || Number(form.estimatedCost) < 0) {
      setError('El costo estimado debe ser un número mayor o igual a 0'); setLoading(false); return;
    }
    if (!form.dueDate) {
      setError('Debes seleccionar una fecha de vencimiento'); setLoading(false); return;
    }
    // Validar que la fecha de vencimiento no sea menor que hoy
    const today = new Date();
    const due = new Date(form.dueDate);
    today.setHours(0,0,0,0);
    if (due < today) {
      setError('La fecha de vencimiento no puede ser anterior a hoy.'); setLoading(false); return;
    }
    try {
      // Enviar solo la fecha (YYYY-MM-DD) en dueDate
      // La fecha de creación la pone el backend (siempre la actual), no se envía desde el frontend
      const payload = { ...form, dueDate: form.dueDate ? form.dueDate.substring(0, 10) : '' };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear ticket');
      }
      setSuccess('Ticket creado correctamente');
      setForm(initialState);
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit} style={{gap: 12, animation: 'fadeIn 0.7s'}} autoComplete="off">
      <h2 style={{textAlign: 'center', color: '#1976d2', fontWeight: 700, fontSize: 28, marginBottom: 12, letterSpacing: 1, textShadow: '0 2px 8px #1976d233', animation: 'slideDown 0.7s'}}>Crear Ticket de Soporte</h2>
      <p style={{textAlign: 'center', color: '#555', fontSize: 15, marginBottom: 18}}>Por favor, completa los campos para registrar tu solicitud. Los campos marcados con * son obligatorios.</p>
      <div className="form-group">
        <input className="form-input" name="requesterName" placeholder="Ej: Juan Pérez" value={form.requesterName} onChange={handleChange} required autoComplete="off" maxLength={40} />
        <label className="form-label">Nombre del solicitante *</label>
        <small style={{color:'#888'}}>¿Quién solicita el soporte?</small>
      </div>
      <div className="form-group">
        <input className="form-input" name="category" placeholder="Ej: Software, Hardware, Red..." value={form.category} onChange={handleChange} required autoComplete="off" maxLength={30} />
        <label className="form-label">Categoría *</label>
        <small style={{color:'#888'}}>Describe el área o tipo de problema</small>
      </div>
      <div className="form-group" style={{display:'flex', gap:8}}>
        <div style={{flex:1}}>
          <label style={{fontWeight:600, color:'#1976d2'}}>Prioridad *</label>
          <select className="form-select" name="priority" value={form.priority} onChange={handleChange} required>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
        </div>
        <div style={{flex:1}}>
          <label style={{fontWeight:600, color:'#1976d2'}}>Estado *</label>
          <select className="form-select" name="status" value={form.status} onChange={handleChange} required>
            <option value="OPEN">Abierto</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="CLOSED">Cerrado</option>
          </select>
        </div>
      </div>
      <div className="form-group" style={{display:'flex', gap:8}}>
        <div style={{flex:2}}>
          <input className="form-input" name="estimatedCost" type="number" placeholder="Ej: 100" value={form.estimatedCost} onChange={handleChange} required autoComplete="off" min="0" />
          <label className="form-label">Costo estimado *</label>
        </div>
        <div style={{flex:1}}>
          <select className="form-select" name="currency" value={form.currency} onChange={handleChange} required>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          <label className="form-label" style={{top: -12, left: 10, fontSize: '0.92rem', color: '#1976d2', background: '#fff', padding: '0 6px', borderRadius: 6}}>Moneda</label>
        </div>
      </div>
      <div className="form-group">
        <input className="form-input" name="dueDate" type="datetime-local" placeholder="Selecciona fecha y hora" value={form.dueDate} onChange={handleChange} required autoComplete="off" />
        <label className="form-label">Fecha de vencimiento *</label>
        <small style={{color:'#888'}}>¿Hasta cuándo se debe resolver?</small>
      </div>
      <button className="form-btn" type="submit" disabled={loading} style={{fontWeight:700, fontSize:18}}>
        {loading ? 'Creando...' : 'Crear Ticket'}
      </button>
      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}
    </form>
  );
}

export default TicketForm;

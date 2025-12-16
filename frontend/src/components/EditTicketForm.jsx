import React, { useState } from 'react';
import { THEME } from '../theme';

const API_URL = import.meta.env.VITE_API_URL;

function EditTicketForm({ ticket, onClose, onSaved }) {
  const [form, setForm] = useState({ ...ticket });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
      setError('Debes seleccionar una fecha y hora de vencimiento'); setLoading(false); return;
    }
    try {
      const res = await fetch(`${API_URL}/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al actualizar ticket');
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-detail-modal" style={{animation: 'fadeIn 0.5s'}}>
      <div className="ticket-detail-content" style={{position: 'relative', animation: 'slideDown 0.5s'}}>
        <button className="close-btn" onClick={onClose} style={{position: 'absolute', top: 10, right: 10, background: '#eee', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontWeight: 700, fontSize: 18, color: '#1976d2', boxShadow: '0 2px 8px #1976d233', transition: 'background 0.2s'}} onMouseEnter={e => e.currentTarget.style.background = '#bbdefb'} onMouseLeave={e => e.currentTarget.style.background = '#eee'}>×</button>
        <h2 style={{textAlign: 'center', color: '#1976d2', fontWeight: 700, fontSize: 24, marginBottom: 12, letterSpacing: 1, textShadow: '0 2px 8px #1976d233'}}>Editar Ticket</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <input className="form-input" name="requesterName" placeholder="Nombre del solicitante" value={form.requesterName} onChange={handleChange} required autoComplete="off" />
            <label className="form-label">Nombre del solicitante</label>
          </div>
          <div className="form-group">
            <select className="form-select" name="status" value={form.status} onChange={handleChange} required>
              <option value="OPEN">Abierto</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="CLOSED">Cerrado</option>
            </select>
            <label className="form-label" style={{top: -12, left: 10, fontSize: '0.92rem', color: '#1976d2', background: '#fff', padding: '0 6px', borderRadius: 6}}>Estado</label>
          </div>
          <div className="form-group">
            <select className="form-select" name="priority" value={form.priority} onChange={handleChange} required>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
            <label className="form-label" style={{top: -12, left: 10, fontSize: '0.92rem', color: '#1976d2', background: '#fff', padding: '0 6px', borderRadius: 6}}>Prioridad</label>
          </div>
          <div className="form-group">
            <input className="form-input" name="category" placeholder="Categoría" value={form.category} onChange={handleChange} required autoComplete="off" />
            <label className="form-label">Categoría</label>
          </div>
          <div className="form-group">
            <input className="form-input" name="estimatedCost" type="number" placeholder="Costo estimado" value={form.estimatedCost} onChange={handleChange} required autoComplete="off" min="0" />
            <label className="form-label">Costo estimado</label>
          </div>
          <div className="form-group">
            <select className="form-select" name="currency" value={form.currency} onChange={handleChange} required>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <label className="form-label" style={{top: -12, left: 10, fontSize: '0.92rem', color: '#1976d2', background: '#fff', padding: '0 6px', borderRadius: 6}}>Moneda</label>
          </div>
          <div className="form-group">
            <input className="form-input" name="dueDate" type="datetime-local" placeholder="Fecha de vencimiento" value={form.dueDate} onChange={handleChange} required autoComplete="off" />
            <label className="form-label">Fecha de vencimiento</label>
          </div>
          <button className="form-btn" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
      <style>{`
        .ticket-detail-modal {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;
        }
        .ticket-detail-content {
          background: #fff; padding: 2rem; border-radius: 8px; min-width: 300px; position: relative;
        }
        .close-btn {
          position: absolute; top: 10px; right: 10px; background: #eee; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default EditTicketForm;

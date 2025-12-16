import React from 'react';

function TicketDetail({ ticket, onClose }) {
  if (!ticket) return null;
  return (
    <div className="ticket-detail-modal">
      <div className="ticket-detail-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Detalle del Ticket</h2>
        <ul>
          <li><b>#:</b> {ticket.ticketNumber}</li>
          <li><b>Solicitante:</b> {ticket.requesterName}</li>
          <li><b>Estado:</b> {ticket.status}</li>
          <li><b>Prioridad:</b> {ticket.priority}</li>
          <li><b>Categoría:</b> {ticket.category}</li>
          <li><b>Costo:</b> {ticket.estimatedCost}</li>
          <li><b>Moneda:</b> {ticket.currency}</li>
          <li><b>Creado:</b> {ticket.createdAt}</li>
          <li><b>Vence:</b> {ticket.dueDate}</li>
        </ul>
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

export default TicketDetail;

import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
      padding: '1rem 0',
      boxShadow: '0 2px 8px #1976d233',
      marginBottom: 32,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 32,
      fontSize: 18,
      fontWeight: 600,
      borderRadius: 0,
      letterSpacing: 1,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>Soporte Tickets</Link>
      <Link to="/tickets" style={{ color: '#fff', textDecoration: 'none' }}>Ver Tickets</Link>
      <Link to="/crear" style={{ color: '#fff', textDecoration: 'none' }}>Crear Ticket</Link>
    </nav>
  );
}

export default Navbar;

import React from 'react';

function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
      color: '#fff',
      textAlign: 'center',
      padding: '18px 0 12px 0',
      fontWeight: 500,
      fontSize: 16,
      letterSpacing: 1,
      position: 'fixed',
      left: 0,
      bottom: 0,
      zIndex: 99,
      boxShadow: '0 -2px 8px #1976d233',
    }}>
      © {new Date().getFullYear()} Sistema de Soporte | Hecho con ♥ por tu equipo
    </footer>
  );
}

export default Footer;

import { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const listRef = useRef();
  const handleCreated = () => {
    if (listRef.current && listRef.current.fetchTickets) {
      listRef.current.fetchTickets();
    }
  };
  return (
    <Router>
      <Navbar />
      <div className="ticket-main">
        <Routes>
          <Route path="/" element={
            <div style={{
              minHeight: '60vh',
              width: '100%',
              maxWidth: 900,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.7s',
              boxSizing: 'border-box',
              padding: '2vw',
            }}>
              <h1 style={{
                fontSize: 40,
                color: '#1976d2',
                fontWeight: 800,
                letterSpacing: 2,
                textShadow: '0 2px 8px #1976d233',
                marginBottom: 16,
                animation: 'slideDown 0.7s',
              }}>Bienvenido al Sistema de Soporte</h1>
              <p style={{ fontSize: 22, color: '#333', marginBottom: 32, textAlign: 'center', maxWidth: 500 }}>
                Gestiona tus tickets de soporte de manera fácil y rápida. Usa el menú para navegar entre las opciones CRUD.
              </p>
              <div style={{ display: 'flex', gap: 24 }}>
                <Link to="/tickets" style={{
                  background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 20,
                  padding: '16px 36px',
                  fontWeight: 700,
                  fontSize: 20,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px #1976d233',
                  transition: 'transform 0.15s',
                  animation: 'fadeIn 1s',
                  display: 'inline-block',
                }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>Ver Tickets</Link>
                <Link to="/crear" style={{
                  background: 'linear-gradient(90deg, #388e3c 60%, #81c784 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 20,
                  padding: '16px 36px',
                  fontWeight: 700,
                  fontSize: 20,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px #388e3c33',
                  transition: 'transform 0.15s',
                  animation: 'fadeIn 1.2s',
                  display: 'inline-block',
                }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>Crear Ticket</Link>
              </div>
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(30px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-30px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </div>
          } />
          <Route path="/tickets" element={<TicketList ref={listRef} />} />
          <Route path="/crear" element={<TicketForm onCreated={handleCreated} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

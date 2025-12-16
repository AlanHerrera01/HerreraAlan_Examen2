import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { THEME } from '../theme';
import TicketDetail from './TicketDetail';
import EditTicketForm from './EditTicketForm';

const API_URL = import.meta.env.VITE_API_URL;

const TicketList = forwardRef((props, ref) => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editTicket, setEditTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: '',
    status: '',
    currency: '',
    minCost: '',
    maxCost: '',
    from: '',
    to: '',
    page: 0,
    size: 10,
    sort: 'createdAt,desc',
  });
  const [pageInfo, setPageInfo] = useState({ totalPages: 1, number: 0 });

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line
  }, [filters]);

  useImperativeHandle(ref, () => ({
    fetchTickets,
  }));

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          // Solo enviar status si es válido
          if (key === 'status' && !['OPEN','IN_PROGRESS','RESOLVED','CLOSED','CANCELLED'].includes(value)) return;
          // Solo enviar currency si es válido
          if (key === 'currency' && !['USD','EUR'].includes(value)) return;
          // Convertir fechas a ISO si existen
          if ((key === 'from' || key === 'to') && value) {
            // value es tipo 'YYYY-MM-DDTHH:mm', convertir a 'YYYY-MM-DDTHH:mm:ss'
            const iso = value.length === 16 ? value + ':00' : value;
            params.append(key, iso);
            return;
          }
          params.append(key, value);
        }
      });
      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) throw new Error('Error al obtener tickets');
      const data = await res.json();
      setTickets(data.content || []);
      setPageInfo({ totalPages: data.totalPages, number: data.number });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 0 });
  };

  const handlePage = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };


  return (
    <div className="ticket-main" style={{
      transition: 'box-shadow 0.3s',
      animation: 'fadeIn 0.7s',
      width: '100%',
      minHeight: '60vh',
      boxSizing: 'border-box',
      padding: '2vw 0',
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 32,
        letterSpacing: 1,
        color: '#1976d2',
        fontWeight: 700,
        textShadow: '0 2px 8px #1976d233',
        animation: 'slideDown 0.7s',
      }}>Tickets de Soporte</h2>
      <div style={{maxWidth:900,margin:'0 auto 18px auto',padding:'24px 18px',background:'#fff',borderRadius:18,boxShadow:'0 2px 16px #1976d233',display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
        <form className="filters" onSubmit={e => e.preventDefault()} style={{display:'flex',flexWrap:'wrap',gap:16,alignItems:'center',justifyContent:'center',width:'100%'}}>
          <input name="q" placeholder="Buscar..." value={filters.q} onChange={handleChange} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #b3c6e0',fontSize:15,minWidth:160}} />
          <select name="status" value={filters.status} onChange={handleChange} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #b3c6e0',fontSize:15}}>
            <option value="">Estado</option>
            <option value="OPEN">Abierto</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="RESOLVED">Resuelto</option>
            <option value="CLOSED">Cerrado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
          <select name="currency" value={filters.currency} onChange={handleChange} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #b3c6e0',fontSize:15}}>
            <option value="">Moneda</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <input name="minCost" type="number" min="0" placeholder="Costo mínimo" value={filters.minCost} onChange={handleChange} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #b3c6e0',fontSize:15,maxWidth:120}} />
          <input name="maxCost" type="number" min="0" placeholder="Costo máximo" value={filters.maxCost} onChange={handleChange} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #b3c6e0',fontSize:15,maxWidth:120}} />
          <div style={{display:'flex',flexDirection:'column',gap:2}}>
            <span style={{fontSize:13,color:'#1976d2',marginBottom:2}}>Rango de fecha y hora</span>
            <div style={{display:'flex',gap:6}}>
              <input name="from" type="datetime-local" value={filters.from} onChange={handleChange} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #b3c6e0',fontSize:15}} placeholder="Fecha y hora inicial" />
              <input name="to" type="datetime-local" value={filters.to} onChange={handleChange} style={{padding:'8px 14px',borderRadius:8,border:'1px solid #b3c6e0',fontSize:15}} placeholder="Fecha y hora final" />
            </div>
          </div>
          <button type="button" onClick={() => setFilters({q:'',status:'',currency:'',minCost:'',maxCost:'',from:'',to:'',page:0,size:10,sort:'createdAt,desc'})} style={{padding:'8px 22px',borderRadius:8,border:'none',background:'linear-gradient(90deg,#1976d2 60%,#64b5f6 100%)',color:'#fff',fontWeight:700,cursor:'pointer',boxShadow:'0 2px 8px #1976d233',transition:'background 0.2s'}}>Limpiar todo</button>
        </form>
        {/* Chips de filtros activos */}
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8,justifyContent:'center'}}>
          {Object.entries(filters).filter(([k,v])=>v!==''&&k!=='page'&&k!=='size'&&k!=='sort').map(([k,v])=>{
            let label = '';
            switch(k){
              case 'q': label = `Búsqueda: "${v}"`; break;
              case 'status':
                if(v==='OPEN') label = 'Estado: Abierto';
                else if(v==='IN_PROGRESS') label = 'Estado: En Progreso';
                else if(v==='RESOLVED') label = 'Estado: Resuelto';
                else if(v==='CLOSED') label = 'Estado: Cerrado';
                else if(v==='CANCELLED') label = 'Estado: Cancelado';
                else label = `Estado: ${v}`; break;
              case 'currency': label = `Moneda: ${v}`; break;
              case 'minCost': label = `Costo mínimo: ${v}`; break;
              case 'maxCost': label = `Costo máximo: ${v}`; break;
              case 'from': label = `Desde: ${v.replace('T',' ')}`; break;
              case 'to': label = `Hasta: ${v.replace('T',' ')}`; break;
              default: label = `${k}: ${v}`;
            }
            return (
              <span key={k} style={{display:'inline-flex',alignItems:'center',background:'#e3f0ff',color:'#1976d2',borderRadius:16,padding:'6px 14px',fontSize:14,fontWeight:500,boxShadow:'0 1px 4px #1976d233',animation:'fadeIn 0.3s'}}>
                {label}
                <button onClick={()=>setFilters(f=>({...f,[k]:''}))} style={{marginLeft:8,background:'none',border:'none',color:'#1976d2',fontWeight:700,fontSize:16,cursor:'pointer',lineHeight:1}}>×</button>
              </span>
            );
          })}
        </div>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: 'red', textAlign: 'center', marginTop: 32, fontSize: 20 }}>
          {error === 'Failed to fetch' || error.includes('NetworkError')
            ? 'Error al conectarse al backend. Verifica que el backend esté corriendo y la URL sea correcta.'
            : error === 'Error al obtener tickets'
              ? 'No hay datos en la base de datos o hubo un error al consultar los tickets.'
              : error}
        </p>
      ) : (
        <>
          {tickets.length === 0 ? (
            <p style={{ color: '#1976d2', textAlign: 'center', marginTop: 32, fontSize: 20 }}>
              No hay tickets para mostrar.
            </p>
          ) : (
            <>
              <table style={{animation: 'fadeIn 0.7s'}}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Solicitante</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Categoría</th>
                    <th>Costo</th>
                    <th>Moneda</th>
                    <th>Creado</th>
                    <th>Vence</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, i) => (
                    <tr key={t.id} style={{cursor: 'pointer'}}>
                      <td onClick={() => setSelected(t)}>{t.ticketNumber}</td>
                      <td onClick={() => setSelected(t)}>{t.requesterName}</td>
                      <td onClick={() => setSelected(t)}>{t.status}</td>
                      <td onClick={() => setSelected(t)}>{t.priority}</td>
                      <td onClick={() => setSelected(t)}>{t.category}</td>
                      <td onClick={() => setSelected(t)}>{t.estimatedCost}</td>
                      <td onClick={() => setSelected(t)}>{t.currency}</td>
                      <td onClick={() => setSelected(t)}>{t.createdAt}</td>
                      <td onClick={() => setSelected(t)}>{t.dueDate}</td>
                      <td className="table-actions">
                        <button
                          onClick={e => { e.stopPropagation(); setEditTicket(t); }}
                          className="form-btn"
                          style={{background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)', padding: '6px 18px', fontSize: 15, marginBottom: 2}}
                        >Editar</button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(t.id); }}
                          className="form-btn"
                          style={{background: 'linear-gradient(90deg, #d32f2f 60%, #ff8a65 100%)', padding: '6px 18px', fontSize: 15, marginBottom: 2}}
                        >Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 12, animation: 'fadeIn 0.7s'}}>
                <button disabled={pageInfo.number === 0} onClick={() => handlePage(pageInfo.number - 1)} style={{padding: '8px 22px', borderRadius: 20, border: 'none', background: pageInfo.number === 0 ? '#eee' : 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)', color: pageInfo.number === 0 ? '#888' : '#fff', cursor: pageInfo.number === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, boxShadow: '0 2px 8px #1976d233', transition: 'transform 0.15s'}} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>Anterior</button>
                <span style={{fontWeight: 500}}>Página {pageInfo.number + 1} de {pageInfo.totalPages}</span>
                <button disabled={pageInfo.number + 1 >= pageInfo.totalPages} onClick={() => handlePage(pageInfo.number + 1)} style={{padding: '8px 22px', borderRadius: 20, border: 'none', background: pageInfo.number + 1 >= pageInfo.totalPages ? '#eee' : 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)', color: pageInfo.number + 1 >= pageInfo.totalPages ? '#888' : '#fff', cursor: pageInfo.number + 1 >= pageInfo.totalPages ? 'not-allowed' : 'pointer', fontWeight: 600, boxShadow: '0 2px 8px #1976d233', transition: 'transform 0.15s'}} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>Siguiente</button>
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
              {selected && <TicketDetail ticket={selected} onClose={() => setSelected(null)} />}
              {editTicket && (
                <EditTicketForm
                  ticket={editTicket}
                  onClose={() => setEditTicket(null)}
                  onSaved={() => { setEditTicket(null); fetchTickets(); }}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );

  async function handleDelete(id) {
    if (!window.confirm('¿Seguro que deseas eliminar este ticket?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar ticket');
      fetchTickets();
    } catch (err) {
      alert(err.message);
    }
  }
});

export default TicketList;

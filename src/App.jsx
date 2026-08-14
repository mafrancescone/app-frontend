import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "https://api-medica.mafrancescones.workers.dev";

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#1e293b", backgroundColor: "#f8fafc", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "24px" },
  logo: { fontSize: "20px", fontWeight: "700", color: "#0284c7", display: "flex", alignItems: "center", gap: "8px" },
  nav: { display: "flex", gap: "8px" },
  navLink: (active) => ({ textDecoration: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", color: active ? "#0284c7" : "#64748b", backgroundColor: active ? "#e0f2fe" : "transparent" }),
  card: { backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0" },
  input: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  btnPrimary: { width: "100%", padding: "12px", backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  btnSuccess: { width: "100%", padding: "12px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  btnSm: (bg) => ({ padding: "6px 12px", backgroundColor: bg, color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", marginRight: "6px" }),
  badge: (status) => {
    let bg = "#fef3c7"; let color = "#d97706";
    if (status === "Completada") { bg = "#d1fae5"; color = "#059669"; }
    if (status === "Cancelada") { bg = "#fee2e2"; color = "#dc2626"; }
    return { display: "inline-block", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: bg, color: color };
  },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0", marginTop: "12px" },
  th: { backgroundColor: "#f1f5f9", padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#475569", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "14px 16px", fontSize: "14px", borderBottom: "1px solid #f1f5f9", color: "#334155" }
};

function Navigation() {
  const location = useLocation();
  return (
    <div style={styles.header}>
      <div style={styles.logo}>🏥 <span>MedControl Pro</span></div>
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink(location.pathname === "/")}>Inicio</Link>
        <Link to="/pacientes" style={styles.navLink(location.pathname === "/pacientes" || location.pathname === "/paciente")}>Pacientes</Link>
        <Link to="/medicos" style={styles.navLink(location.pathname === "/medicos" || location.pathname === "/medico")}>Médicos</Link>
        <Link to="/secretaria" style={styles.navLink(location.pathname === "/secretaria")}>Secretaría</Link>
      </nav>
    </div>
  );
}

// --- PORTAL DEL PACIENTE ---
function PantallaPaciente() {
  const [citas, setCitas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/citas`).then(res => res.json()).then(data => setCitas(data)).catch(console.error);
  }, []);

  const misCitas = citas.filter(c => c.paciente && c.paciente.toLowerCase().includes(busqueda.toLowerCase()) && busqueda.trim() !== "");

  return (
    <div style={styles.card}>
      <h2 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>Portal del Paciente</h2>
      <p style={{ color: "#64748b", marginBottom: "20px" }}>Consulta tus próximas citas e historial médico ingresando tu nombre:</p>
      
      <input type="text" placeholder="Ingresa tu Nombre Completo para buscar..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ ...styles.input, marginBottom: "20px", maxWidth: "400px" }} />

      {busqueda.trim() !== "" && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>FECHA</th>
              <th style={styles.th}>HORA</th>
              <th style={styles.th}>MOTIVO</th>
              <th style={styles.th}>ESTADO</th>
              <th style={styles.th}>INDICACIONES / NOTAS</th>
            </tr>
          </thead>
          <tbody>
            {misCitas.length === 0 ? (
              <tr><td colSpan="5" style={{ ...styles.td, textAlign: "center", color: "#94a3b8" }}>No se encontraron citas a tu nombre.</td></tr>
            ) : (
              misCitas.map(c => (
                <tr key={c.id}>
                  <td style={styles.td}>{c.fecha}</td>
                  <td style={{ ...styles.td, fontWeight: "600" }}>{c.hora} hs</td>
                  <td style={styles.td}>{c.motivo}</td>
                  <td style={styles.td}><span style={styles.badge(c.estado)}>{c.estado}</span></td>
                  <td style={{ ...styles.td, fontStyle: "italic", color: "#475569" }}>{c.notas || "Sin observaciones."}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

// --- PANEL MÉDICO ---
function PantallaMedico() {
  const [citas, setCitas] = useState([]);
  const [notaTexto, setNotaTexto] = useState({});

  const cargarCitas = async () => {
    try {
      const res = await fetch(`${API_URL}/citas`);
      if (res.ok) {
        const data = await res.json();
        setCitas(data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargarCitas(); }, []);

  const actualizarCita = async (id, estadoActual) => {
    const notas = notaTexto[id] !== undefined ? notaTexto[id] : "";
    await fetch(`${API_URL}/citas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: estadoActual, notas }),
    });
    cargarCitas();
  };

  return (
    <div style={styles.card}>
      <h2 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>Panel de Atención Médica 👨‍⚕️</h2>
      <p style={{ color: "#64748b", marginBottom: "20px" }}>Gestión de pacientes del día y consulta de diagnósticos.</p>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>HORA / FECHA</th>
            <th style={styles.th}>PACIENTE</th>
            <th style={styles.th}>MOTIVO</th>
            <th style={styles.th}>ESTADO</th>
            <th style={styles.th}>DIAGNÓSTICO / NOTAS</th>
            <th style={styles.th}>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {citas.length === 0 ? (
            <tr><td colSpan="6" style={{ ...styles.td, textAlign: "center", color: "#94a3b8" }}>No hay citas agendadas aún.</td></tr>
          ) : (
            citas.map(c => (
              <tr key={c.id}>
                <td style={styles.td}><strong>{c.hora} hs</strong><br/><small style={{ color: "#94a3b8" }}>{c.fecha}</small></td>
                <td style={{ ...styles.td, fontWeight: "600", color: "#0284c7" }}>{c.paciente}</td>
                <td style={styles.td}>{c.motivo}</td>
                <td style={styles.td}><span style={styles.badge(c.estado)}>{c.estado}</span></td>
                <td style={styles.td}>
                  <input 
                    type="text" 
                    placeholder="Escribir receta o diagnóstico..." 
                    defaultValue={c.notas} 
                    onChange={e => setNotaTexto({ ...notaTexto, [c.id]: e.target.value })}
                    style={{ ...styles.input, padding: "6px 10px", fontSize: "12px" }}
                  />
                </td>
                <td style={styles.td}>
                  <button onClick={() => actualizarCita(c.id, "Completada")} style={styles.btnSm("#10b981")}>✓ Atendido</button>
                  <button onClick={() => actualizarCita(c.id, "Cancelada")} style={styles.btnSm("#ef4444")}>✕ Cancelar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- SECRETARÍA ---
function PantallaSecretaria() {
  const [pacientes, setPacientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const [citas, setCitas] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const cargarPacientes = async () => {
    try {
      const res = await fetch(`${API_URL}/pacientes`);
      if (res.ok) {
        const data = await res.json();
        setPacientes(data);
        if (data.length > 0 && !pacienteId) setPacienteId(data[0].id);
      }
    } catch (err) { console.error(err); }
  };

  const cargarCitas = async () => {
    try {
      const res = await fetch(`${API_URL}/citas`);
      if (res.ok) {
        const data = await res.json();
        setCitas(data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargarPacientes(); cargarCitas(); }, []);

  const manejarSubmitPaciente = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/pacientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_completo: nombre, telefono, email }),
    });
    setNombre(""); setTelefono(""); setEmail("");
    cargarPacientes();
  };

  const manejarSubmitCita = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/citas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paciente_id: pacienteId, fecha, hora, motivo }),
    });
    setFecha(""); setHora(""); setMotivo("");
    cargarCitas();
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        <div style={styles.card}>
          <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "16px", fontWeight: "700" }}>👤 Registrar Paciente</h3>
          <form onSubmit={manejarSubmitPaciente} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="Nombre Completo" value={nombre} onChange={e => setNombre(e.target.value)} required style={styles.input} />
            <input type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required style={styles.input} />
            <input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
            <button type="submit" style={styles.btnPrimary}>+ Guardar Paciente</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "16px", fontWeight: "700" }}>📅 Agendar Cita Médica</h3>
          <form onSubmit={manejarSubmitCita} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <select value={pacienteId} onChange={e => setPacienteId(e.target.value)} required style={styles.input}>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre_completo} ({p.telefono})</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required style={styles.input} />
              <input type="time" value={hora} onChange={e => setHora(e.target.value)} required style={styles.input} />
            </div>
            <input type="text" placeholder="Motivo de consulta" value={motivo} onChange={e => setMotivo(e.target.value)} required style={styles.input} />
            <button type="submit" style={styles.btnSuccess}>Confirmar Cita</button>
          </form>
        </div>
      </div>

      <div style={{ ...styles.card, marginBottom: "32px" }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", fontSize: "18px" }}>📆 Agenda Global de Turnos</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>FECHA</th>
              <th style={styles.th}>HORA</th>
              <th style={styles.th}>PACIENTE</th>
              <th style={styles.th}>MOTIVO</th>
              <th style={styles.th}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((c) => (
              <tr key={c.id}>
                <td style={styles.td}>{c.fecha}</td>
                <td style={{ ...styles.td, fontWeight: "600" }}>{c.hora} hs</td>
                <td style={{ ...styles.td, fontWeight: "600", color: "#0284c7" }}>{c.paciente}</td>
                <td style={styles.td}>{c.motivo}</td>
                <td style={styles.td}><span style={styles.badge(c.estado)}>{c.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.container}>
        <Navigation />
        <Routes>
          <Route path="/" element={
            <div style={{ ...styles.card, textAlign: "center", padding: "60px 20px" }}>
              <h1 style={{ fontSize: "28px", color: "#0f172a", marginBottom: "12px" }}>Bienvenido a MedControl Pro 🏥</h1>
              <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto" }}>Sistema médico integral en la nube con paneles independientes para Médicos, Secretaría y Pacientes.</p>
            </div>
          } />
          <Route path="/pacientes" element={<PantallaPaciente />} />
          <Route path="/paciente" element={<PantallaPaciente />} />
          <Route path="/medicos" element={<PantallaMedico />} />
          <Route path="/medico" element={<PantallaMedico />} />
          <Route path="/secretaria" element={<PantallaSecretaria />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

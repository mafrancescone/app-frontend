import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "https://api-medica.mafrancescones.workers.dev";

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "20px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#1e293b" },
  card: { backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0" },
  input: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  btnPrimary: { width: "100%", padding: "12px", backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  btnSuccess: { width: "100%", padding: "12px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  btnDanger: { padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
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

// --- COMPONENTE DE LOGIN PARA STAFF ---
function Login({ rol, onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password, rol }),
      });
      if (res.ok) {
        onLogin();
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto" }}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          🔒 Acceso {rol === "medico" ? "Médico" : "Secretaría"}
        </h2>
        {error && <div style={{ color: "#ef4444", marginBottom: "12px", fontSize: "14px", textAlign: "center" }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="text" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} required style={styles.input} />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>Ingresar</button>
        </form>
      </div>
    </div>
  );
}

// --- PORTAL PACIENTES (LINK PÚBLICO/PACIENTES) ---
function PortalPacientes() {
  const [citas, setCitas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/citas`).then(res => res.json()).then(data => setCitas(data)).catch(console.error);
  }, []);

  const misCitas = citas.filter(c => c.paciente && c.paciente.toLowerCase().includes(busqueda.toLowerCase()) && busqueda.trim() !== "");

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ margin: "0 0 10px 0", color: "#0284c7" }}>🏥 Portal de Consulta de Pacientes</h2>
        <p style={{ color: "#64748b", marginBottom: "20px" }}>Ingresa tu Nombre Completo para consultar tus turnos e indicaciones médicas:</p>
        
        <input type="text" placeholder="Ej. Maxi" value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ ...styles.input, marginBottom: "20px" }} />

        {busqueda.trim() !== "" && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>FECHA</th>
                <th style={styles.th}>HORA</th>
                <th style={styles.th}>MOTIVO</th>
                <th style={styles.th}>ESTADO</th>
                <th style={styles.th}>INDICACIONES / RECETA</th>
              </tr>
            </thead>
            <tbody>
              {misCitas.length === 0 ? (
                <tr><td colSpan="5" style={{ ...styles.td, textAlign: "center", color: "#94a3b8" }}>No hay turnos registrados a ese nombre.</td></tr>
              ) : (
                misCitas.map(c => (
                  <tr key={c.id}>
                    <td style={styles.td}>{c.fecha}</td>
                    <td style={{ ...styles.td, fontWeight: "600" }}>{c.hora} hs</td>
                    <td style={styles.td}>{c.motivo}</td>
                    <td style={styles.td}><span style={styles.badge(c.estado)}>{c.estado}</span></td>
                    <td style={{ ...styles.td, fontStyle: "italic", color: "#0369a1", fontWeight: "500" }}>{c.notas || "Sin observaciones todavía."}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// --- PORTAL MÉRICO (REQUIERE CONTRASEÑA) ---
function PortalMedico() {
  const [autenticado, setAutenticado] = useState(false);
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

  useEffect(() => { if (autenticado) cargarCitas(); }, [autenticado]);

  const actualizarCita = async (id, estadoActual) => {
    const notas = notaTexto[id] !== undefined ? notaTexto[id] : "";
    await fetch(`${API_URL}/citas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: estadoActual, notas }),
    });
    cargarCitas();
  };

  if (!autenticado) return <Login rol="medico" onLogin={() => setAutenticado(true)} />;

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>👨‍⚕️ Panel de Atención Médica</h2>
        <button onClick={() => setAutenticado(false)} style={styles.btnDanger}>Cerrar Sesión</button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>HORA / FECHA</th>
              <th style={styles.th}>PACIENTE</th>
              <th style={styles.th}>MOTIVO</th>
              <th style={styles.th}>ESTADO</th>
              <th style={styles.th}>INDICACIÓN / RECETA</th>
              <th style={styles.th}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {citas.map(c => (
              <tr key={c.id}>
                <td style={styles.td}><strong>{c.hora} hs</strong><br/><small style={{ color: "#94a3b8" }}>{c.fecha}</small></td>
                <td style={{ ...styles.td, fontWeight: "600", color: "#0284c7" }}>{c.paciente}</td>
                <td style={styles.td}>{c.motivo}</td>
                <td style={styles.td}><span style={styles.badge(c.estado)}>{c.estado}</span></td>
                <td style={styles.td}>
                  <input 
                    type="text" 
                    placeholder="Escribir receta o indicación..." 
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- PORTAL SECRETARÍA (REQUIERE CONTRASEÑA) ---
function PortalSecretaria() {
  const [autenticado, setAutenticado] = useState(false);
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

  useEffect(() => {
    if (autenticado) {
      cargarPacientes();
      cargarCitas();
    }
  }, [autenticado]);

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

  if (!autenticado) return <Login rol="secretaria" onLogin={() => setAutenticado(true)} />;

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>📋 Panel de Gestión de Secretaría</h2>
        <button onClick={() => setAutenticado(false)} style={styles.btnDanger}>Cerrar Sesión</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        <div style={styles.card}>
          <h3 style={{ margin: "0 0 16px 0" }}>👤 Registrar Nuevo Paciente</h3>
          <form onSubmit={manejarSubmitPaciente} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="Nombre Completo" value={nombre} onChange={e => setNombre(e.target.value)} required style={styles.input} />
            <input type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required style={styles.input} />
            <input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
            <button type="submit" style={styles.btnPrimary}>+ Guardar Paciente</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={{ margin: "0 0 16px 0" }}>📅 Agendar Cita Médica</h3>
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

      <div style={styles.card}>
        <h3>📆 Agenda Global de Turnos</h3>
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
      <Routes>
        <Route path="/pacientes" element={<PortalPacientes />} />
        <Route path="/medico" element={<PortalMedico />} />
        <Route path="/secretaria" element={<PortalSecretaria />} />
        <Route path="*" element={
          <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: "sans-serif" }}>
            <h1>Acceso al Sistema Médico 🏥</h1>
            <p style={{ color: "#64748b" }}>Ingresa directamente mediante el enlace proporcionado por la clínica.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

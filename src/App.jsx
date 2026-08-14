import { BrowserRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "https://api-medica.mafrancescones.workers.dev";

const NOMBRES_DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "20px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#1e293b" },
  card: { backgroundColor: "#ffffff", padding: "28px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0" },
  input: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  btnPrimary: { width: "100%", padding: "12px", backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  btnSuccess: { width: "100%", padding: "12px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  btnDanger: { padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  btnBack: { display: "inline-block", marginBottom: "16px", color: "#0284c7", textDecoration: "none", fontWeight: "600", fontSize: "14px" },
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

function generarSlotsHoras(inicio, fin, pasoMin) {
  if (!inicio || !fin) return [];
  const slots = [];
  let [hInicio, mInicio] = inicio.split(":").map(Number);
  let [hFin, mFin] = fin.split(":").map(Number);

  let actual = hInicio * 60 + mInicio;
  const limite = hFin * 60 + mFin;

  while (actual < limite) {
    let hh = Math.floor(actual / 60).toString().padStart(2, "0");
    let mm = (actual % 60).toString().padStart(2, "0");
    slots.push(`${hh}:${mm}`);
    actual += pasoMin;
  }
  return slots;
}

function getFechaHoyFormateada() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// --- HOME ---
function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, textAlign: "center", paddingTop: "40px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", color: "#0f172a", marginBottom: "4px" }}>🏥 MedControl Pro</h1>
        <p style={{ fontSize: "20px", color: "#0284c7", fontWeight: "700", marginTop: "0", marginBottom: "16px" }}>
          Doc. Matias Delgado
        </p>
        <p style={{ color: "#64748b", fontSize: "16px" }}>Bienvenido al sistema de gestión médica. Selecciona tu tipo de usuario para ingresar:</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        <div style={{ ...styles.card, cursor: "pointer" }} onClick={() => navigate("/pacientes")}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧑‍🤝‍🧑</div>
          <h2 style={{ fontSize: "20px", color: "#0284c7", margin: "0 0 8px 0" }}>Portal Pacientes</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px 0" }}>Consulta tus turnos agendados e indicaciones o recetas médicas.</p>
          <button style={styles.btnPrimary}>Ingresar como Paciente →</button>
        </div>

        <div style={{ ...styles.card, cursor: "pointer" }} onClick={() => navigate("/medico")}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>👨‍⚕️</div>
          <h2 style={{ fontSize: "20px", color: "#0f172a", margin: "0 0 8px 0" }}>Panel Médico</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px 0" }}>Atención de pacientes, configuración de horarios semanales y recetas.</p>
          <button style={styles.btnPrimary}>Acceso Profesionales 🔒</button>
        </div>

        <div style={{ ...styles.card, cursor: "pointer" }} onClick={() => navigate("/secretaria")}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
          <h2 style={{ fontSize: "20px", color: "#0f172a", margin: "0 0 8px 0" }}>Panel Secretaría</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px 0" }}>Gestión de registros de pacientes y otorgamiento de citas.</p>
          <button style={styles.btnPrimary}>Acceso Secretaría 🔒</button>
        </div>
      </div>
    </div>
  );
}

// --- LOGIN ---
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
    <div style={{ maxWidth: "400px", margin: "60px auto" }}>
      <Link to="/" style={styles.btnBack}>← Volver al Menú Principal</Link>
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

// --- PORTAL PACIENTES ---
function PortalPacientes() {
  const [citas, setCitas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/citas`).then(res => res.json()).then(data => setCitas(data)).catch(console.error);
  }, []);

  const misCitas = citas.filter(c => c.paciente && c.paciente.toLowerCase().includes(busqueda.toLowerCase()) && busqueda.trim() !== "");

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.btnBack}>← Volver al Menú Principal</Link>
      <div style={styles.card}>
        <h2 style={{ margin: "0 0 4px 0", color: "#0284c7" }}>🏥 Portal de Consulta de Pacientes</h2>
        <p style={{ fontSize: "16px", color: "#0f172a", fontWeight: "600", marginTop: "0", marginBottom: "16px" }}>Doc. Matias Delgado</p>
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

// --- PORTAL MÉDICO ---
function PortalMedico() {
  const [autenticado, setAutenticado] = useState(false);
  const [citas, setCitas] = useState([]);
  const [notaTexto, setNotaTexto] = useState({});
  const [horariosDias, setHorariosDias] = useState([]);

  const cargarCitas = async () => {
    try {
      const res = await fetch(`${API_URL}/citas`);
      if (res.ok) {
        const data = await res.json();
        setCitas(data);
      }
    } catch (err) { console.error(err); }
  };

  const cargarHorariosDias = async () => {
    try {
      const res = await fetch(`${API_URL}/horarios-dias`);
      if (res.ok) {
        const data = await res.json();
        setHorariosDias(data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    if (autenticado) {
      cargarCitas(); 
      cargarHorariosDias();
    }
  }, [autenticado]);

  const actualizarCita = async (id, estadoActual) => {
    const notas = notaTexto[id] !== undefined ? notaTexto[id] : "";
    await fetch(`${API_URL}/citas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: estadoActual, notas }),
    });
    cargarCitas();
  };

  const manejarCambioHorario = (diaSemana, campo, valor) => {
    setHorariosDias(prev => prev.map(item => item.dia_semana === diaSemana ? { ...item, [campo]: valor } : item));
  };

  const guardarHorariosSemanales = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/horarios-dias`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(horariosDias),
    });
    alert("¡Configuración semanal de horarios actualizada con éxito!");
  };

  if (!autenticado) return <Login rol="medico" onLogin={() => setAutenticado(true)} />;

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <Link to="/" style={styles.btnBack}>← Menú Principal</Link>
          <h2 style={{ margin: 0 }}>👨‍⚕️ Panel de Atención Médica</h2>
          <small style={{ color: "#0284c7", fontWeight: "bold" }}>Doc. Matias Delgado</small>
        </div>
        <button onClick={() => setAutenticado(false)} style={styles.btnDanger}>Cerrar Sesión</button>
      </div>

      <div style={{ ...styles.card, marginBottom: "24px", background: "#f8fafc" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>⚙️ Configurar Disponibilidad Semanal</h3>
        <form onSubmit={guardarHorariosSemanales}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            {horariosDias.map(h => (
              <div key={h.dia_semana} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span style={{ width: "90px", fontWeight: "bold", fontSize: "13px" }}>{NOMBRES_DIAS[h.dia_semana]}:</span>
                
                <label style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <input type="checkbox" checked={!!h.atiende} onChange={e => manejarCambioHorario(h.dia_semana, "atiende", e.target.checked)} />
                  Atiende
                </label>

                {h.atiende ? (
                  <>
                    <input type="time" value={h.hora_inicio} onChange={e => manejarCambioHorario(h.dia_semana, "hora_inicio", e.target.value)} style={{ ...styles.input, width: "110px", padding: "4px 8px" }} />
                    <span style={{ fontSize: "12px" }}>a</span>
                    <input type="time" value={h.hora_fin} onChange={e => manejarCambioHorario(h.dia_semana, "hora_fin", e.target.value)} style={{ ...styles.input, width: "110px", padding: "4px 8px" }} />
                    
                    <select value={h.duracion_minutos} onChange={e => manejarCambioHorario(h.dia_semana, "duracion_minutos", e.target.value)} style={{ ...styles.input, width: "130px", padding: "4px 8px" }}>
                      <option value={15}>15 min/turno</option>
                      <option value={20}>20 min/turno</option>
                      <option value={30}>30 min/turno</option>
                      <option value={60}>60 min/turno</option>
                    </select>
                  </>
                ) : (
                  <span style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>Día no laboral / Sin atención</span>
                )}
              </div>
            ))}
          </div>
          <button type="submit" style={{ ...styles.btnPrimary, width: "auto", padding: "10px 24px" }}>Guardar Agenda Semanal</button>
        </form>
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

// --- PORTAL SECRETARÍA ---
function PortalSecretaria() {
  const [autenticado, setAutenticado] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  
  const [pacienteEditandoId, setPacienteEditandoId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const [citas, setCitas] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [fecha, setFecha] = useState(getFechaHoyFormateada());
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const [horariosDias, setHorariosDias] = useState([]);

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

  const cargarHorariosDias = async () => {
    try {
      const res = await fetch(`${API_URL}/horarios-dias`);
      if (res.ok) {
        const data = await res.json();
        setHorariosDias(data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (autenticado) {
      cargarPacientes();
      cargarCitas();
      cargarHorariosDias();
    }
  }, [autenticado]);

  const manejarSubmitPaciente = async (e) => {
    e.preventDefault();
    if (pacienteEditandoId) {
      await fetch(`${API_URL}/pacientes/${pacienteEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_completo: nombre, telefono, email }),
      });
      setPacienteEditandoId(null);
    } else {
      await fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_completo: nombre, telefono, email }),
      });
    }
    setNombre(""); setTelefono(""); setEmail("");
    cargarPacientes();
  };

  const iniciarEdicionPaciente = (p) => {
    setPacienteEditandoId(p.id);
    setNombre(p.nombre_completo);
    setTelefono(p.telefono);
    setEmail(p.email || "");
  };

  const eliminarPaciente = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este paciente?")) {
      await fetch(`${API_URL}/pacientes/${id}`, { method: "DELETE" });
      cargarPacientes();
    }
  };

  const manejarSubmitCita = async (e) => {
    e.preventDefault();
    if (!hora) {
      alert("Por favor selecciona un horario disponible.");
      return;
    }
    const res = await fetch(`${API_URL}/citas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paciente_id: pacienteId, fecha, hora, motivo }),
    });

    if (res.ok) {
      setHora(""); setMotivo("");
      cargarCitas();
    } else {
      const data = await res.json();
      alert(data.message || "Error al agendar cita");
    }
  };

  if (!autenticado) return <Login rol="secretaria" onLogin={() => setAutenticado(true)} />;

  const fechaPartes = fecha.split("-");
  const fechaObj = new Date(parseInt(fechaPartes[0]), parseInt(fechaPartes[1]) - 1, parseInt(fechaPartes[2]));
  const numDiaSemana = fechaObj.getDay();

  const configDiaActual = horariosDias.find(h => h.dia_semana === numDiaSemana) || { atiende: 1, hora_inicio: "09:00", hora_fin: "17:00", duracion_minutos: 30 };

  const slotsGenerados = configDiaActual.atiende 
    ? generarSlotsHoras(configDiaActual.hora_inicio, configDiaActual.hora_fin, configDiaActual.duracion_minutos)
    : [];

  const horasOcupadas = citas.filter(c => c.fecha === fecha && c.estado !== "Cancelada").map(c => c.hora);

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <Link to="/" style={styles.btnBack}>← Menú Principal</Link>
          <h2 style={{ margin: 0 }}>📋 Panel de Gestión de Secretaría</h2>
          <small style={{ color: "#0284c7", fontWeight: "bold" }}>Doc. Matias Delgado</small>
        </div>
        <button onClick={() => setAutenticado(false)} style={styles.btnDanger}>Cerrar Sesión</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        
        {/* Formulario Registrar / Editar Paciente */}
        <div style={styles.card}>
          <h3 style={{ margin: "0 0 16px 0", color: pacienteEditandoId ? "#d97706" : "#0f172a" }}>
            {pacienteEditandoId ? "✏️ Editar Paciente" : "👤 Registrar Nuevo Paciente"}
          </h3>
          <form onSubmit={manejarSubmitPaciente} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="Nombre Completo" value={nombre} onChange={e => setNombre(e.target.value)} required style={styles.input} />
            <input type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required style={styles.input} />
            <input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} />
            
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" style={pacienteEditandoId ? { ...styles.btnPrimary, backgroundColor: "#d97706" } : styles.btnPrimary}>
                {pacienteEditandoId ? "Actualizar Datos" : "+ Guardar Paciente"}
              </button>
              {pacienteEditandoId && (
                <button type="button" onClick={() => { setPacienteEditandoId(null); setNombre(""); setTelefono(""); setEmail(""); }} style={{ ...styles.btnDanger, backgroundColor: "#64748b" }}>Cancelar</button>
              )}
            </div>
          </form>
        </div>

        {/* Formulario Agendar Cita */}
        <div style={styles.card}>
          <h3 style={{ margin: "0 0 16px 0" }}>📅 Agendar Cita Médica</h3>
          <form onSubmit={manejarSubmitCita} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Paciente:</label>
            <select value={pacienteId} onChange={e => setPacienteId(e.target.value)} required style={styles.input}>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre_completo} ({p.telefono})</option>
              ))}
            </select>

            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Fecha de Cita (Solo Fechas Futuras):</label>
            <input 
              type="date" 
              value={fecha} 
              min={getFechaHoyFormateada()} 
              onChange={e => { setFecha(e.target.value); setHora(""); }} 
              required 
              style={styles.input} 
            />

            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Horarios ({NOMBRES_DIAS[numDiaSemana]}):
            </label>

            {!configDiaActual.atiende ? (
              <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#dc2626", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>
                🚫 El médico no atiende los días {NOMBRES_DIAS[numDiaSemana]}. Por favor elige otra fecha.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: "6px", maxHeight: "140px", overflowY: "auto", padding: "6px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                {slotsGenerados.map(slot => {
                  const ocupado = horasOcupadas.includes(slot);
                  const seleccionado = hora === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={ocupado}
                      onClick={() => setHora(slot)}
                      style={{
                        padding: "6px 2px",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "6px",
                        border: "none",
                        cursor: ocupado ? "not-allowed" : "pointer",
                        backgroundColor: ocupado ? "#fee2e2" : seleccionado ? "#0284c7" : "#e0f2fe",
                        color: ocupado ? "#ef4444" : seleccionado ? "#fff" : "#0284c7"
                      }}
                    >
                      {slot} {ocupado ? "✕" : ""}
                    </button>
                  );
                })}
              </div>
            )}

            <input type="text" placeholder="Motivo de consulta" value={motivo} onChange={e => setMotivo(e.target.value)} required style={styles.input} />
            <button type="submit" disabled={!configDiaActual.atiende} style={configDiaActual.atiende ? styles.btnSuccess : { ...styles.btnSuccess, backgroundColor: "#cbd5e1", cursor: "not-allowed" }}>
              Confirmar Cita ({hora || "Seleccionar hora"})
            </button>
          </form>
        </div>

      </div>

      {/* TABLA PACIENTES */}
      <div style={{ ...styles.card, marginBottom: "32px" }}>
        <h3>📂 Directorio de Pacientes Carga/Edición</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>NOMBRE COMPLETO</th>
              <th style={styles.th}>TELÉFONO</th>
              <th style={styles.th}>EMAIL</th>
              <th style={styles.th}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td style={{ ...styles.td, color: "#94a3b8" }}>#{p.id}</td>
                <td style={{ ...styles.td, fontWeight: "600" }}>{p.nombre_completo}</td>
                <td style={styles.td}>{p.telefono}</td>
                <td style={{ ...styles.td, color: "#64748b" }}>{p.email || "-"}</td>
                <td style={styles.td}>
                  <button onClick={() => iniciarEdicionPaciente(p)} style={styles.btnSm("#d97706")}>✏️ Editar</button>
                  <button onClick={() => eliminarPaciente(p.id)} style={styles.btnSm("#ef4444")}>🗑️ Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABLA TURNOS */}
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
        <Route path="/" element={<Home />} />
        <Route path="/pacientes" element={<PortalPacientes />} />
        <Route path="/medico" element={<PortalMedico />} />
        <Route path="/secretaria" element={<PortalSecretaria />} />
      </Routes>
    </BrowserRouter>
  );
}

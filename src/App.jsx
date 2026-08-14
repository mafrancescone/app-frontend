import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "https://api-medica.mafrancescones.workers.dev";

function PantallaPaciente() {
  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h2>Portal del Paciente</h2>
      <p>Próximamente: Reserva tu cita médica online.</p>
    </div>
  );
}

function PantallaMedico() {
  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h2>Panel del Médico</h2>
      <p>Próximamente: Consulta tus citas del día.</p>
    </div>
  );
}

function PantallaSecretaria() {
  // Estados para Pacientes
  const [pacientes, setPacientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  // Estados para Citas
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
        if (data.length > 0 && !pacienteId) {
          setPacienteId(data[0].id); // Seleccionar el primero por defecto
        }
      }
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
    }
  };

  const cargarCitas = async () => {
    try {
      const res = await fetch(`${API_URL}/citas`);
      if (res.ok) {
        const data = await res.json();
        setCitas(data);
      }
    } catch (err) {
      console.error("Error al cargar citas:", err);
    }
  };

  useEffect(() => {
    cargarPacientes();
    cargarCitas();
  }, []);

  // Guardar Paciente
  const manejarSubmitPaciente = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_completo: nombre, telefono, email }),
      });
      setNombre("");
      setTelefono("");
      setEmail("");
      cargarPacientes();
    } catch (err) {
      console.error("Error al guardar paciente:", err);
    }
  };

  // Guardar Cita
  const manejarSubmitCita = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paciente_id: pacienteId, fecha, hora, motivo }),
      });
      setFecha("");
      setHora("");
      setMotivo("");
      cargarCitas();
    } catch (err) {
      console.error("Error al agendar cita:", err);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h2>Control de Secretaría</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
        {/* Formulario Registrar Paciente */}
        <div style={{ flex: "1", minWidth: "300px", padding: "20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
          <h3>1. Registrar Nuevo Paciente</h3>
          <form onSubmit={manejarSubmitPaciente} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" placeholder="Nombre Completo" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            <input type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            <input type="email" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            <button type="submit" style={{ padding: "8px 16px", background: "#0369a1", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Guardar Paciente</button>
          </form>
        </div>

        {/* Formulario Agendar Cita */}
        <div style={{ flex: "1", minWidth: "300px", padding: "20px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px" }}>
          <h3>2. Agendar Cita Médica</h3>
          <form onSubmit={manejarSubmitCita} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>Paciente:</label>
            <select value={pacienteId} onChange={e => setPacienteId(e.target.value)} required style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre_completo} ({p.telefono})</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
              <input type="time" value={hora} onChange={e => setHora(e.target.value)} required style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            </div>
            <input type="text" placeholder="Motivo de consulta (ej. Chequeo general)" value={motivo} onChange={e => setMotivo(e.target.value)} required style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            <button type="submit" style={{ padding: "8px 16px", background: "#15803d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Agendar Cita</button>
          </form>
        </div>
      </div>

      {/* Tabla de Citas Agendadas */}
      <h3>Agenda de Citas Médicas</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", border: "1px solid #cbd5e1", marginBottom: "40px" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
            <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Fecha</th>
            <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Hora</th>
            <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Paciente</th>
            <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Motivo</th>
            <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {citas.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: "15px", textAlign: "center", color: "#64748b" }}>No hay citas agendadas aún.</td>
            </tr>
          ) : (
            citas.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: "10px", border: "1px solid #cbd5e1" }}>{c.fecha}</td>
                <td style={{ padding: "10px", border: "1px solid #cbd5e1" }}>{c.hora}</td>
                <td style={{ padding: "10px", border: "1px solid #cbd5e1" }}><strong>{c.paciente}</strong></td>
                <td style={{ padding: "10px", border: "1px solid #cbd5e1" }}>{c.motivo}</td>
                <td style={{ padding: "10px", border: "1px solid #cbd5e1", color: "#0369a1", fontWeight: "bold" }}>{c.estado}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Tabla de Pacientes */}
      <h3>Lista de Pacientes Registrados</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", border: "1px solid #cbd5e1" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
            <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Nombre</th>
            <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Teléfono</th>
            <th style={{ padding: "10px", border: "1px solid #cbd5e1" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: "15px", textAlign: "center", color: "#64748b" }}>Cargando pacientes desde la nube...</td>
            </tr>
          ) : (
            pacientes.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: "10px", border: "1px solid #cbd5e1" }}>{p.id}</td>
                <td style={{ padding: "10px", border: "1px solid #cbd5e1" }}>{p.nombre_completo}</td>
                <td style={{ padding: "10px", border: "1px solid #cbd5e1" }}>{p.telefono}</td>
                <td style={{ padding: "10px", border: "1px solid #cbd5e1" }}>{p.email || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "sans-serif" }}>
        <nav style={{ padding: "15px", background: "#e0f2fe", borderBottom: "2px solid #bae6fd" }}>
          <Link to="/" style={{ marginRight: "20px", textDecoration: "none", color: "#0369a1", fontWeight: "bold" }}>Inicio</Link>
          <Link to="/paciente" style={{ marginRight: "20px", textDecoration: "none", color: "#0369a1", fontWeight: "bold" }}>Paciente</Link>
          <Link to="/medico" style={{ marginRight: "20px", textDecoration: "none", color: "#0369a1", fontWeight: "bold" }}>Médico</Link>
          <Link to="/secretaria" style={{ textDecoration: "none", color: "#0369a1", fontWeight: "bold" }}>Secretaría</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h1 style={{ padding: "30px" }}>Bienvenido al Sistema Médico</h1>} />
          <Route path="/paciente" element={<PantallaPaciente />} />
          <Route path="/medico" element={<PantallaMedico />} />
          <Route path="/secretaria" element={<PantallaSecretaria />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const fs=require("fs"); const c=`import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function PantallaPaciente() {
  return (
    
      Portal del Paciente
      Selecciona un horario para agendar tu cita medica.
    
  );
}

function PantallaMedico() {
  return (
    
      Panel del Medico
      Agenda del dia y consultas pendientes.
    
  );
}

function PantallaSecretaria() {
  const [pacientes, setPacientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const cargarPacientes = async () => {
    try {
      const res = await fetch("http://localhost:8787/pacientes");
      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8787/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_completo: nombre, telefono, email }),
    });
    setNombre("");
    setTelefono("");
    setEmail("");
    cargarPacientes();
  };

  return (
    
      Control de Secretaria
      
        Registrar Nuevo Paciente
        
           setNombre(e.target.value)} required style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
           setTelefono(e.target.value)} required style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
           setEmail(e.target.value)} style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
          Guardar
        
      
      Lista de Pacientes (Base de Datos D1)
      
        
          
            
            
            
            
          
        
        
          {pacientes.map((p) => (
            
              
              
              
              
            
          ))}
        
      IDNombreTelefonoEmail{p.id}{p.nombre_completo}{p.telefono}{p.email || "-"}
    
  );
}

export default function App() {
  return (
    
      
        
          Inicio
          Paciente
          Medico
          Secretaria
        
        
          Bienvenido al Sistema Medico} />
          } />
          } />
          } />
        
      
    
  );
}
`; fs.writeFileSync("src/App.jsx", c);
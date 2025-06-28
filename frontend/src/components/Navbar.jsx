import logo from "../assets/logo.png";
import { useState } from "react";

function Navbar({ plantas, plantaSeleccionada, setPlantaSeleccionada, setGestion, setModalImagenVisible, setVerInstrucciones, verInstrucciones }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 20px",
      borderBottom: "2px solid #eee",
      background: "#fff"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img src={logo} alt="Logo" style={{ height: "25px" }} />
        {plantas.map(planta => (
          <span
            key={planta.id}
            onClick={() => setPlantaSeleccionada(planta.id)}
            style={{
              cursor: "pointer",
              fontWeight: plantaSeleccionada === planta.id ? "bold" : "normal",
              color: plantaSeleccionada === planta.id ? "#007bff" : "#333",
              borderBottom: plantaSeleccionada === planta.id ? "3px solid #007bff" : "3px solid transparent",
              paddingBottom: "4px"
            }}
          >
            {planta.nombre}
          </span>
        ))}
      </div>

      {/* Botón de configuración con dropdown */}
      <div style={{ position: "relative" }}>
        <button onClick={() => setDropdownVisible(!dropdownVisible)}>⚙️ Configuración ▾</button>

        {dropdownVisible && (
          <div style={{
            position: "absolute",
            top: "40px",
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            zIndex: 100,
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <button onClick={() => { setGestion("addRack"); setDropdownVisible(false); }}>➕ Añadir Rack</button>
            <button onClick={() => { setModalImagenVisible(true); setDropdownVisible(false); }}>📷 Agregar Imagen</button>
            <button onClick={() => { setGestion("deleteRack"); setDropdownVisible(false); }}>🗑️ Borrar Rack</button>
            <button onClick={() => { setGestion("deleteEquipo"); setDropdownVisible(false); }}>🗑️ Borrar Dispositivo</button>
            <button onClick={() => { setVerInstrucciones(prev => !prev); setDropdownVisible(false); }}>
              {verInstrucciones ? "🔽 Ocultar instrucciones" : "❓ Mostrar instrucciones"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;

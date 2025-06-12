import { useState } from "react";

function Layout({ children }) {
  const [opcion, setOpcion] = useState("");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Menú lateral */}
      <div style={{
        width: "220px",
        padding: "1rem",
        borderRight: "2px solid #ccc",
        background: "#f9f9f9"
      }}>
        <h3>Gestionar</h3>
        <select value={opcion} onChange={e => setOpcion(e.target.value)} style={{ width: "100%" }}>
          <option value="">-- Seleccionar --</option>
          <option value="addRack">➕ Añadir Rack</option>
          <option value="addEquipo">➕ Añadir Dispositivo</option>
          <option value="deleteRack">🗑️ Borrar Rack</option>
          <option value="deleteEquipo">🗑️ Borrar Dispositivo</option>
        </select>

        {/* Aquí puedes renderizar condicional según opción */}
        {opcion === "addRack" && <p>Formulario para agregar rack</p>}
        {opcion === "addEquipo" && <p>Formulario para agregar dispositivo</p>}
        {/* y así sucesivamente... */}
      </div>

      {/* Contenido principal */}
      <div style={{ flexGrow: 1, padding: "1.5rem" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;

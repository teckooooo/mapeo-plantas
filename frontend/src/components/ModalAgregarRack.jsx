import { useState } from "react";

const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost/mapeo-plantas/backend"
  : "http://192.168.1.152/mapeo-plantas/backend";

function ModalAgregarRack({ plantaId, visible, onClose, onSuccess }) {
  const [numero, setNumero] = useState("");
  const [descripcion, setDescripcion] = useState("");

  if (!visible) return null;

  const handleSubmit = () => {
    if (!numero.trim()) return alert("El número del rack es obligatorio");

    fetch(`${BASE_URL}/api/create_rack.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planta_id: plantaId,
        numero,
        descripcion,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onSuccess();
          onClose();
          setNumero("");
          setDescripcion("");
        } else {
          alert("Error al agregar rack");
        }
      });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff", padding: "20px", borderRadius: "8px",
        minWidth: "300px", boxShadow: "0 0 10px rgba(0,0,0,0.3)"
      }}>
        <h3>Agregar nuevo Rack</h3>
        <label>Número:</label>
        <input
          type="text"
          value={numero}
          onChange={e => setNumero(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalAgregarRack;

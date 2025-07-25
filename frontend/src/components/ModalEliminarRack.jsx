import { useState, useEffect } from "react";

const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost/mapeo-plantas/backend"
  : "http://192.168.1.152/mapeo-plantas/backend";

function ModalEliminarRack({ plantaId, visible, onClose, onSuccess }) {
  const [racks, setRacks] = useState([]);
  const [rackId, setRackId] = useState("");

  useEffect(() => {
    if (plantaId) {
      fetch(`${BASE_URL}/api/get_racks_by_planta.php?planta_id=${plantaId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setRacks(json.data);
          } else {
            console.error("Respuesta inválida del backend:", json);
            setRacks([]);
          }
        })
        .catch(err => {
          console.error("Error al cargar racks:", err);
          setRacks([]);
        });
    }
  }, [plantaId]);

  if (!visible) return null;

  const handleDelete = () => {
    if (!rackId) return alert("Selecciona un rack");

    fetch(`${BASE_URL}/api/delete_rack.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rack_id: rackId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onSuccess();
          onClose();
        } else {
          alert("Error al eliminar");
        }
      })
      .catch(err => {
        console.error("Error en delete_rack.php:", err);
        alert("Ocurrió un error al eliminar.");
      });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "300px",
        zIndex: 10000
      }}>
        <h3>Eliminar Rack</h3>
        <select
          value={rackId}
          onChange={e => setRackId(e.target.value)}
          style={{ width: "100%" }}
        >
          <option value="">-- Selecciona un rack --</option>
          {Array.isArray(racks) && racks.map(r => (
            <option key={r.id} value={r.id}>Rack {r.numero || r.id}</option>
          ))}
        </select>

        <div style={{ marginTop: "15px", textAlign: "right" }}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEliminarRack;

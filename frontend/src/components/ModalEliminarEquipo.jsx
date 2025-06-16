import { useState, useEffect } from "react";

function ModalEliminarEquipo({ plantaId, visible, onClose, onSuccess }) {
  const [racks, setRacks] = useState([]);
  const [rackId, setRackId] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [equipoId, setEquipoId] = useState("");

  useEffect(() => {
    if (plantaId) {
      fetch(`http://localhost/mapeo-plantas/backend/api/get_racks_by_planta.php?planta_id=${plantaId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setRacks(json.data);
          } else {
            console.error("Respuesta inválida en racks:", json);
            setRacks([]);
          }
        })
        .catch(err => {
          console.error("Error al obtener racks:", err);
          setRacks([]);
        });
    }
  }, [plantaId]);

  useEffect(() => {
    if (rackId) {
      fetch(`http://localhost/mapeo-plantas/backend/api/get_equipos_by_rack.php?rack_id=${rackId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setEquipos(json.data);
          } else {
            console.error("Respuesta inválida en equipos:", json);
            setEquipos([]);
          }
        })
        .catch(err => {
          console.error("Error al obtener equipos:", err);
          setEquipos([]);
        });
    } else {
      setEquipos([]);
    }
  }, [rackId]);

  if (!visible) return null;

  const handleDelete = () => {
    if (!equipoId) return alert("Selecciona un dispositivo");

    fetch("http://localhost/mapeo-plantas/backend/api/delete_equipo.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: equipoId })
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
        console.error("Error en delete_equipo.php:", err);
        alert("Ocurrió un error al eliminar.");
      });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 9999 // 🛡️ asegura que el modal esté por encima de todo
    }}>
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "350px",
        zIndex: 10000 // 🔒 asegura prioridad incluso dentro del modal
      }}>
        <h3>Eliminar Dispositivo</h3>

        <label>Selecciona Rack:</label>
        <select
          value={rackId}
          onChange={e => setRackId(e.target.value)}
          style={{ width: "100%" }}
        >
          <option value="">-- Selecciona un rack --</option>
          {racks.map(r => (
            <option key={r.id} value={r.id}>Rack {r.numero || r.id}</option>
          ))}
        </select>

        <label style={{ marginTop: "10px" }}>Selecciona Dispositivo:</label>
        <select
          value={equipoId}
          onChange={e => setEquipoId(e.target.value)}
          style={{ width: "100%" }}
        >
          <option value="">-- Selecciona un dispositivo --</option>
          {equipos.map(e => (
            <option key={e.id} value={e.id}>
              {e.nombre} – {e.ip || "—"}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "15px", textAlign: "right" }}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalEliminarEquipo;

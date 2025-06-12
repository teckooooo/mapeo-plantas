import { useEffect, useState } from "react";

function RackEsquema({ plantaId }) {
  const [racks, setRacks] = useState([]);

  useEffect(() => {
    if (!plantaId) return;

    fetch(`http://localhost/mapeo-plantas/backend/api/get_racks_by_planta.php?planta_id=${plantaId}`)
      .then(res => res.json())
      .then(data => setRacks(data));
  }, [plantaId]);

  return (
    <div>
      <h3 style={{ marginTop: "30px" }}>Esquema de Racks</h3>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        marginTop: "10px"
      }}>
        {racks.map(rack => (
          <div key={rack.id} style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            minWidth: "120px",
            textAlign: "center",
            background: "#f9f9f9"
          }}>
            <strong>Rack {rack.numero}</strong>
            <p style={{ fontSize: "0.8em" }}>{rack.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RackEsquema;

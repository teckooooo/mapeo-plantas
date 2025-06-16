import { useEffect, useState } from "react";
import RackImageEditor from "./RackImageEditor.tsx";
import './ListaRacks.css';

function ListaRacks({ plantaId, recargar, onNuevaArea }) {
  const [racks, setRacks] = useState([]);
  const [abiertos, setAbiertos] = useState({});

  useEffect(() => {
    if (!plantaId) return;

    fetch(`http://localhost/mapeo-plantas/backend/api/get_racks_con_equipos.php?planta_id=${plantaId}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Respuesta inesperada del backend:", data);
          return;
        }

        const estadoInicial = {};
        data.forEach(r => { estadoInicial[r.id] = true; });
        setAbiertos(estadoInicial);
        setRacks(data);
      })
      .catch(err => console.error("Error al cargar racks:", err));
  }, [plantaId, recargar]);

  const toggleRack = (rackId) => {
    setAbiertos(prev => ({ ...prev, [rackId]: !prev[rackId] }));
  };

  return (
    <div className="lista-rack-container">
      <h3>Racks registrados</h3>
      <div className="rack-grid">
        {racks.map((rack) => (
          <div key={rack.id} className="rack-card">
            <div className="rack-header" onClick={() => toggleRack(rack.id)}>
              <h4>Rack {rack.numero}</h4>
              <button className="toggle-btn">{abiertos[rack.id] ? "−" : "+"}</button>
            </div>

            {abiertos[rack.id] && (
              <>
                <p>{rack.descripcion || <em>Sin descripción</em>}</p>

                {Array.isArray(rack.fotos) && rack.fotos.length > 0 ? (
  rack.fotos.map((foto, idx) => {
    console.log(`📷 Imagen rack ${rack.numero} - ID ${foto.id}:`, foto.src?.substring(0, 100));

    return (
      <div key={idx} className="rack-image-wrapper">
        <RackImageEditor
          foto={foto}
          dispositivos={Array.isArray(rack.equipos)
            ? rack.equipos.filter(e => String(e.imagen_id) === String(foto.id))
            : []}
          onNuevaArea={(area) => onNuevaArea({ ...area, rack_id: rack.id })}
          imagenId={foto.id}
        />
      </div>
    );
  })
) : (
  <p className="sin-equipos">Sin imagen de rack disponible.</p>
)}

              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaRacks;

import { useEffect, useState } from "react";
import './ListaRacks.css';

function ListaRacks({ plantaId, recargar }) {
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
                  rack.fotos.map((foto, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        marginBottom: "20px",
                        maxWidth: '500px'
                      }}
                    >
                      <img
                        src={foto.src}
                        alt={`Rack ${rack.numero} - Imagen ${idx + 1}`}
                        style={{ width: '100%', display: 'block' }}
                      />

                      {/* Áreas interactivas solo si imagen_id coincide */}
                      {Array.isArray(rack.equipos) &&
                        rack.equipos
                          .filter(e => String(e.imagen_id) === String(foto.id))
                          .map(e => (
                            <div
                              key={e.id}
                              title={e.nombre}
                              style={{
                                position: "absolute",
                                top: `${(e.y / 500) * 100}%`,
                                left: `${(e.x / 800) * 100}%`,
                                width: `${(e.width / 800) * 100}%`,
                                height: `${(e.height / 500) * 100}%`,
                                border: "2px dashed #00f",
                                backgroundColor: "rgba(0, 0, 255, 0.1)",
                                cursor: "pointer"
                              }}
                              onClick={() => window.open(`/dispositivo-info.html?id=${e.id}`, "_blank")}
                            />
                          ))}
                    </div>
                  ))
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

import { useEffect, useState } from "react";
import RackImageEditor from "./RackImageEditor.tsx";
import "./ListaRacks.css";

function ListaRacks({ plantaId, recargar, setRecargarDatos, expandirTodo, onNuevaArea }) {
  const [racks, setRacks] = useState([]);
  const [abiertos, setAbiertos] = useState({});
  const STORAGE_KEY = `rack_expandido_por_id_${plantaId}`;

  // Cargar racks y restaurar estado expandido por ID
// Cargar racks y restaurar estado expandido por ID
useEffect(() => {
  if (!plantaId) return;

  const STORAGE_KEY = `rack_expandido_por_id_${plantaId}`; // Mover dentro del efecto

  fetch(`http://localhost/mapeo-plantas/backend/api/get_racks_con_equipos.php?planta_id=${plantaId}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) {
        console.error("Respuesta inesperada del backend:", data);
        return;
      }

      setRacks(data);

      let parsedState = {};
      try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) parsedState = JSON.parse(savedState);
      } catch (e) {
        console.warn("⚠️ Error al leer estado expandido:", e);
      }

      const estadoInicial = {};
      data.forEach(r => {
        estadoInicial[r.id] = parsedState[r.id] ?? true;
      });

      setAbiertos(estadoInicial);
    })
    .catch(err => console.error("Error al cargar racks:", err));
}, [plantaId, recargar]);


  // Aplicar expansión global si se solicita
  useEffect(() => {
    if (expandirTodo === null || racks.length === 0) return;

    const nuevoEstado = {};
    racks.forEach(r => {
      nuevoEstado[r.id] = expandirTodo;
    });

    setAbiertos(nuevoEstado);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoEstado));
  }, [expandirTodo, racks, STORAGE_KEY]);

  const toggleRack = (rackId) => {
    setAbiertos(prev => {
      const actualizado = { ...prev, [rackId]: !prev[rackId] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizado));
      return actualizado;
    });
  };

  const handleEliminarFoto = (fotoId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta imagen?")) return;

    fetch("http://localhost/mapeo-plantas/backend/api/delete_imagen.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagen_id: fotoId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRecargarDatos(prev => !prev);
        } else {
          alert("No se pudo eliminar la imagen.");
        }
      })
      .catch(err => {
        console.error("Error al eliminar imagen:", err);
        alert("Ocurrió un error al eliminar la imagen.");
      });
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
                    <div key={idx} className="rack-image-wrapper">
                      <div className="rack-image-container">
                        <RackImageEditor
                          foto={foto}
                          dispositivos={Array.isArray(rack.equipos)
                            ? rack.equipos.filter(e => String(e.imagen_id) === String(foto.id))
                            : []}
                          onNuevaArea={(area) => onNuevaArea({ ...area, rack_id: rack.id })}
                          imagenId={foto.id}
                        />
                        <button
                          onClick={() => handleEliminarFoto(foto.id)}
                          className="btn-eliminar-imagen"
                        >
                          🗑️
                        </button>
                      </div>
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

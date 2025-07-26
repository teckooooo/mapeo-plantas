import { useEffect, useState, useMemo } from "react";
import RackImageEditor from "./RackImageEditor.tsx";
import "./ListaRacks.css";

const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost/mapeo-plantas/backend"
  : "http://192.168.1.152/mapeo-plantas/backend";




function ListaRacks({ plantaId, recargar, setRecargarDatos, expandirTodo, onNuevaArea }) {
  const [racks, setRacks] = useState([]);
  const [abiertos, setAbiertos] = useState({fa});
  const [mostrarBotonesEliminar, setMostrarBotonesEliminar] = useState(false);

  const STORAGE_KEY = useMemo(() => `rack_expandido_por_id_${plantaId}`, [plantaId]);

  useEffect(() => {
  const listener = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'q') {
      setMostrarBotonesEliminar(prev => !prev);
    }
  };

  window.addEventListener("keydown", listener);
  return () => window.removeEventListener("keydown", listener);
}, []);

  useEffect(() => {
    if (!plantaId) return;

    fetch(`${BASE_URL}/api/get_racks_con_equipos.php?planta_id=${plantaId}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Respuesta inesperada del backend:", data);
          return;
        }

        setRacks(data);

        try {
          const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
          const estadoInicial = {};
          data.forEach(r => {
            estadoInicial[r.id] = savedState[r.id] ?? true;
          });
          setAbiertos(estadoInicial);
        } catch (e) {
          console.warn("⚠️ Error al restaurar estado expandido:", e);
        }
      })
      .catch(err => console.error("Error al cargar racks:", err));
  }, [plantaId, recargar, STORAGE_KEY]);

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

    fetch(`${BASE_URL}/api/delete_imagen.php`, {
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
                        {mostrarBotonesEliminar && (
  <button
    onClick={() => handleEliminarFoto(foto.id)}
    className="btn-eliminar-imagen"
  >
    🗑️
  </button>
)}

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

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import EsquemaImagen from "./components/EsquemaImagen";
import ModalAgregarRack from "./components/ModalAgregarRack";
import ModalAgregarEquipo from "./components/ModalAgregarEquipo";
import ModalEliminarRack from "./components/ModalEliminarRack";
import ModalEliminarEquipo from "./components/ModalEliminarEquipo";
import Notificacion from "./components/Notificacion";
import ListaRacks from "./components/ListaRacks";

function App() {
  const [plantas, setPlantas] = useState([]);
  const [plantaSeleccionada, setPlantaSeleccionada] = useState(null);
  const [gestion, setGestion] = useState("");

  const [modalRackVisible, setModalRackVisible] = useState(false);
  const [modalEquipoVisible, setModalEquipoVisible] = useState(false);
  const [modalEliminarRackVisible, setModalEliminarRackVisible] = useState(false);
  const [modalEliminarEquipoVisible, setModalEliminarEquipoVisible] = useState(false);

  const [recargarDatos, setRecargarDatos] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const [modalImagenVisible, setModalImagenVisible] = useState(false);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [rackDestino, setRackDestino] = useState("");
  const [racksDisponibles, setRacksDisponibles] = useState([]);

  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [expandirTodo, setExpandirTodo] = useState(null);

  const mostrarNotificacion = (mensaje, tipo = "success") => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion(null), 3000);
  };

  const plantaActual = plantas.find((p) => p.id === plantaSeleccionada);

  useEffect(() => {
    fetch("http://localhost/mapeo-plantas/backend/api/get_plantas.php")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPlantas(data);
          setPlantaSeleccionada(data[0].id);
        } else {
          console.error("No se recibieron plantas");
        }
      });
  }, []);

useEffect(() => {
  if (!plantaSeleccionada) return;

  fetch(`http://localhost/mapeo-plantas/backend/api/get_racks_by_planta.php?planta_id=${plantaSeleccionada}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.data)) {
        setRacksDisponibles(data.data);
      } else {
        console.error("Respuesta inesperada:", data);
        setRacksDisponibles([]);
      }
    })
    .catch(err => {
      console.error("Error al obtener racks:", err);
      setRacksDisponibles([]);
    });

  // ✅ Mover aquí para que sea recalculado dinámicamente
  const STORAGE_KEY = `rack_expandido_${plantaSeleccionada}`;
  const savedExpandir = localStorage.getItem(STORAGE_KEY);
  if (savedExpandir !== null) {
    setExpandirTodo(savedExpandir === "true");
  }

}, [plantaSeleccionada, recargarDatos]);


  useEffect(() => {
    if (gestion === "addRack") setModalRackVisible(true);
    if (gestion === "addEquipo") setModalEquipoVisible(true);
    if (gestion === "deleteRack") setModalEliminarRackVisible(true);
    if (gestion === "deleteEquipo") setModalEliminarEquipoVisible(true);
  }, [gestion]);

  const subirImagen = () => {
    if (!rackDestino || !imagenArchivo) {
      alert("Selecciona un rack e imagen.");
      return;
    }

    fetch("http://localhost/mapeo-plantas/backend/api/guardar_imagen.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rack_id: rackDestino,
        nombre_archivo: `imagen_${Date.now()}.jpg`,
        data_larga: imagenArchivo
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          mostrarNotificacion("📸 Imagen añadida al rack");
          setModalImagenVisible(false);
          setRecargarDatos(prev => !prev);
        } else {
          alert("Error al subir imagen.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Fallo al subir imagen.");
      });
  };

const handleExpandir = (estado) => {
  setExpandirTodo(estado);
  if (plantaSeleccionada) {
    const STORAGE_KEY = `rack_expandido_${plantaSeleccionada}`;
    localStorage.setItem(STORAGE_KEY, estado.toString());
  }
};


  return (
    <div>
      <Navbar
        plantas={plantas}
        plantaSeleccionada={plantaSeleccionada}
        setPlantaSeleccionada={setPlantaSeleccionada}
      />

      <main style={{ padding: "20px" }}>
        <h2>Esquema de racks para: {plantaActual?.nombre || "..."}</h2>

        <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
          <button className={`gestion-btn ${gestion === "addRack" ? "active" : ""}`} onClick={() => setGestion("addRack")}>
            ➕ Añadir Rack
          </button>

          <button className="gestion-btn" onClick={() => setModalImagenVisible(true)}>📷 Agregar Imagen</button>

          <button className={`gestion-btn ${gestion === "deleteRack" ? "active" : ""}`} onClick={() => setGestion("deleteRack")}>
            🗑️ Borrar Rack
          </button>
          <button className={`gestion-btn ${gestion === "deleteEquipo" ? "active" : ""}`} onClick={() => setGestion("deleteEquipo")}>
            🗑️ Borrar Dispositivo
          </button>
        </div>

        <EsquemaImagen
          plantaNombre={plantaActual?.nombre}
          recargar={recargarDatos}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", margin: "10px 0" }}>
          <button onClick={() => handleExpandir(true)}>🔽 Expandir todos</button>
          <button onClick={() => handleExpandir(false)}>🔼 Contraer todos</button>
        </div>

        <ListaRacks
          plantaId={plantaSeleccionada}
          recargar={recargarDatos}
          setRecargarDatos={setRecargarDatos}
          onNuevaArea={(area) => {
            setAreaSeleccionada(area);
            setModalVisible(true);
          }}
          expandirTodo={expandirTodo}
        />

        {modalVisible && (
          <ModalAgregarEquipo
            visible={modalVisible}
            plantaId={plantaSeleccionada}
            areaPreseleccionada={areaSeleccionada}
            onClose={() => setModalVisible(false)}
            onSuccess={() => {
              setModalVisible(false);
              setRecargarDatos(prev => !prev);
              mostrarNotificacion("✅ Dispositivo agregado desde área seleccionada");
            }}
          />
        )}

        {modalRackVisible && (
          <ModalAgregarRack
            plantaId={plantaSeleccionada}
            visible={modalRackVisible}
            onClose={() => { setModalRackVisible(false); setGestion(""); }}
            onSuccess={() => {
              setModalRackVisible(false);
              setGestion("");
              setRecargarDatos(prev => !prev);
              mostrarNotificacion("✅ Rack agregado exitosamente");
            }}
          />
        )}

        {modalEquipoVisible && (
          <ModalAgregarEquipo
            plantaId={plantaSeleccionada}
            visible={modalEquipoVisible}
            onClose={() => { setModalEquipoVisible(false); setGestion(""); }}
            onSuccess={() => {
              setModalEquipoVisible(false);
              setGestion("");
              setRecargarDatos(prev => !prev);
              mostrarNotificacion("✅ Dispositivo agregado correctamente");
            }}
          />
        )}

        {modalEliminarRackVisible && (
          <ModalEliminarRack
            plantaId={plantaSeleccionada}
            visible={modalEliminarRackVisible}
            onClose={() => { setModalEliminarRackVisible(false); setGestion(""); }}
            onSuccess={() => {
              setModalEliminarRackVisible(false);
              setGestion("");
              setRecargarDatos(prev => !prev);
              mostrarNotificacion("🗑️ Rack eliminado");
            }}
          />
        )}

        {modalEliminarEquipoVisible && (
          <ModalEliminarEquipo
            plantaId={plantaSeleccionada}
            visible={modalEliminarEquipoVisible}
            onClose={() => { setModalEliminarEquipoVisible(false); setGestion(""); }}
            onSuccess={() => {
              setModalEliminarEquipoVisible(false);
              setGestion("");
              setRecargarDatos(prev => !prev);
              mostrarNotificacion("🗑️ Dispositivo eliminado");
            }}
          />
        )}

        {modalImagenVisible && (
          <div className="modal" style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 1000
          }}>
            <div style={{
              background: "#fff", padding: "20px", borderRadius: "8px",
              width: "400px", maxHeight: "90vh", overflowY: "auto"
            }}>
              <h3>Subir Imagen a Rack</h3>

              <label>Seleccionar Rack:</label>
              <select
                value={rackDestino}
                onChange={(e) => setRackDestino(e.target.value)}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <option value="">-- Elige un rack --</option>
                {racksDisponibles.map((rack) => (
                  <option key={rack.id} value={rack.id}>
                    Rack {rack.numero || rack.id}
                  </option>
                ))}
              </select>

              <label>Imagen:</label>
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setImagenArchivo(reader.result);
                reader.readAsDataURL(file);
              }} />

              <div style={{ marginTop: "10px", textAlign: "right" }}>
                <button onClick={() => setModalImagenVisible(false)}>Cancelar</button>
                <button onClick={subirImagen} style={{ marginLeft: "10px" }}>Subir Imagen</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {notificacion && (
        <Notificacion mensaje={notificacion.mensaje} tipo={notificacion.tipo} />
      )}
    </div>
  );
}

export default App;

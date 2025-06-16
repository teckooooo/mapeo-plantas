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

  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const mostrarNotificacion = (mensaje, tipo = "success") => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion(null), 3000);
  };

  useEffect(() => {
    fetch("http://localhost/mapeo-plantas/backend/api/get_plantas.php")
      .then(res => res.json())
      .then(data => {
        setPlantas(data);
        setPlantaSeleccionada(data[0]?.id);
      });
  }, []);

  useEffect(() => {
    if (gestion === "addRack") setModalRackVisible(true);
    if (gestion === "addEquipo") setModalEquipoVisible(true);
    if (gestion === "deleteRack") setModalEliminarRackVisible(true);
    if (gestion === "deleteEquipo") setModalEliminarEquipoVisible(true);
  }, [gestion]);

  return (
    <div>
      <Navbar
        plantas={plantas}
        plantaSeleccionada={plantaSeleccionada}
        setPlantaSeleccionada={setPlantaSeleccionada}
      />

      <main style={{ padding: "20px" }}>
        <h2>
          Esquema de racks para:{" "}
          {plantas.find((p) => p.id === plantaSeleccionada)?.nombre}
        </h2>

        <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
          <button
            className={`gestion-btn ${gestion === "addRack" ? "active" : ""}`}
            onClick={() => setGestion("addRack")}
          >
            ➕ Añadir Rack
          </button>
          <button
            className={`gestion-btn ${gestion === "addEquipo" ? "active" : ""}`}
            onClick={() => setGestion("addEquipo")}
          >
            ➕ Añadir Dispositivo
          </button>
          <button
            className={`gestion-btn ${gestion === "deleteRack" ? "active" : ""}`}
            onClick={() => setGestion("deleteRack")}
          >
            🗑️ Borrar Rack
          </button>
          <button
            className={`gestion-btn ${gestion === "deleteEquipo" ? "active" : ""}`}
            onClick={() => setGestion("deleteEquipo")}
          >
            🗑️ Borrar Dispositivo
          </button>
        </div>

        <EsquemaImagen
          plantaNombre={plantas.find((p) => p.id === plantaSeleccionada)?.nombre}
          recargar={recargarDatos}
        />

        {gestion === "addRack" && (
          <ModalAgregarRack
            plantaId={plantaSeleccionada}
            visible={modalRackVisible}
            onClose={() => {
              setModalRackVisible(false);
              setGestion("");
            }}
            onSuccess={() => {
              setModalRackVisible(false);
              setGestion("");
              setRecargarDatos(prev => !prev);
              mostrarNotificacion("✅ Rack agregado exitosamente");
            }}
          />
        )}

        {gestion === "addEquipo" && (
          <ModalAgregarEquipo
            plantaId={plantaSeleccionada}
            visible={modalEquipoVisible}
            onClose={() => {
              setModalEquipoVisible(false);
              setGestion("");
            }}
            onSuccess={() => {
              setModalEquipoVisible(false);
              setGestion("");
              setRecargarDatos(prev => !prev);
              mostrarNotificacion("✅ Dispositivo agregado correctamente");
            }}
          />
        )}

        {gestion === "deleteRack" && (
          <ModalEliminarRack
            plantaId={plantaSeleccionada}
            visible={modalEliminarRackVisible}
            onClose={() => {
              setModalEliminarRackVisible(false);
              setGestion("");
            }}
            onSuccess={() => {
              setModalEliminarRackVisible(false);
              setGestion("");
              setRecargarDatos(prev => !prev);
              mostrarNotificacion("🗑️ Rack eliminado");
            }}
          />
        )}

        {gestion === "deleteEquipo" && (
          <ModalEliminarEquipo
            plantaId={plantaSeleccionada}
            visible={modalEliminarEquipoVisible}
            onClose={() => {
              setModalEliminarEquipoVisible(false);
              setGestion("");
            }}
            onSuccess={() => {
              setModalEliminarEquipoVisible(false);
              setGestion("");
              setRecargarDatos(prev => !prev);
              mostrarNotificacion("🗑️ Dispositivo eliminado");
            }}
          />
        )}

        <ListaRacks
  plantaId={plantaSeleccionada}
  recargar={recargarDatos}
  onNuevaArea={(area) => {
    setAreaSeleccionada(area);
    setModalVisible(true);
  }}
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

      </main>

      {notificacion && (
        <Notificacion
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
        />
      )}
    </div>
  );
}

export default App;

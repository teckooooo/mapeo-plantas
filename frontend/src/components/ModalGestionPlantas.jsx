import React, { useState } from "react";

function ModalGestionPlantas({
  visible,
  onClose,
  nuevaPlanta,
  setNuevaPlanta,
  plantas,
  onAgregar,
  onEliminar,
  onEditar,
  onRecargar // ✅ Nuevo callback
}) {
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [imagenBase64, setImagenBase64] = useState({});
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const comenzarEdicion = (planta) => {
    setEditandoId(planta.id);
    setNombreEditado(planta.nombre);
  };

  const guardarEdicion = () => {
    if (!nombreEditado.trim()) return;
    onEditar(editandoId, nombreEditado.trim());
    setEditandoId(null);
    setNombreEditado("");
    onRecargar?.(); // ✅ recarga luego de editar
  };

  const handleFileChange = (plantaId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagenBase64((prev) => ({ ...prev, [plantaId]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const subirEsquema = (plantaId) => {
    const base64 = imagenBase64[plantaId];
    if (!base64) {
      alert("Selecciona una imagen primero.");
      return;
    }

    setLoading(true);
    fetch("http://localhost/mapeo-plantas/backend/api/upload_esquema.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planta_id: plantaId, base64 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          alert("✅ Imagen de esquema subida correctamente.");
          onRecargar?.(); // ✅ recarga
        } else {
          alert("❌ Error al subir esquema.");
          console.error(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error de red:", err);
        alert("Error al subir imagen.");
      });
  };

  const eliminarEsquema = (plantaId) => {
    if (!window.confirm("¿Eliminar la imagen de esquema de esta planta?")) return;

    fetch("http://localhost/mapeo-plantas/backend/api/delete_esquema.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planta_id: plantaId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("🗑️ Esquema eliminado correctamente.");
          onRecargar?.(); // ✅ recarga
        } else {
          alert("❌ Error al eliminar esquema.");
          console.error(data);
        }
      })
      .catch((err) => {
        console.error("Error al eliminar esquema:", err);
        alert("Fallo en la conexión al servidor.");
      });
  };

  return (
    <div className="modal" style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#fff", padding: "20px", borderRadius: "8px",
        width: "500px", maxHeight: "90vh", overflowY: "auto"
      }}>
        <h3>🛠️ Gestión de Plantas</h3>

        <input
          type="text"
          value={nuevaPlanta}
          onChange={(e) => setNuevaPlanta(e.target.value)}
          placeholder="Nombre de nueva planta"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button onClick={onAgregar} style={{ marginBottom: "20px" }}>
          ➕ Agregar Planta
        </button>

        <ul>
          {plantas.map((p) => (
            <li key={p.id} style={{ marginBottom: "20px" }}>
              {editandoId === p.id ? (
                <>
                  <input
                    type="text"
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                    style={{ marginRight: "5px" }}
                  />
                  <button onClick={guardarEdicion}>💾 Guardar</button>
                  <button onClick={() => setEditandoId(null)} style={{ marginLeft: "5px" }}>❌ Cancelar</button>
                </>
              ) : (
                <>
                  <strong>{p.nombre}</strong>
                  <button onClick={() => comenzarEdicion(p)} style={{ marginLeft: "10px" }}>✏️ Editar</button>
                  <button onClick={() => onEliminar(p.id)} style={{ marginLeft: "5px", color: "red" }}>
                    🗑️ Eliminar
                  </button>
                </>
              )}

              <div style={{ marginTop: "10px" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(p.id, e)}
                />
                <button
                  onClick={() => subirEsquema(p.id)}
                  style={{ marginLeft: "5px" }}
                  disabled={loading}
                >
                  {loading ? "Subiendo..." : "📤 Subir Esquema"}
                </button>
                <button
                  onClick={() => eliminarEsquema(p.id)}
                  style={{ marginLeft: "5px", color: "darkred" }}
                >
                  🗑️ Quitar Esquema
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button onClick={() => {
            onRecargar?.(); // ✅ recarga al salir del modal también
            onClose();
          }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalGestionPlantas;

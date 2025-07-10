import React, { useState } from "react";
import "./ModalGestionPlantas.css";

function ModalGestionPlantas({
  visible,
  onClose,
  nuevaPlanta,
  setNuevaPlanta,
  plantas,
  onAgregar,
  onEliminar,
  onEditar,
  onRecargar
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
    onRecargar?.();
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
          onRecargar?.();
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
          onRecargar?.();
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
    <div className="modal-planta">
      <div className="modal-content">
        <h3>🛠️ Gestión de Plantas</h3>

        <input
          type="text"
          value={nuevaPlanta}
          onChange={(e) => setNuevaPlanta(e.target.value)}
          placeholder="Nombre de nueva planta"
        />
        <button onClick={onAgregar}>➕ Agregar Planta</button>

        <ul>
          {plantas.map((p) => (
            <li key={p.id}>
              {editandoId === p.id ? (
                <>
                  <input
                    type="text"
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                  />
                  <button onClick={guardarEdicion}>💾 Guardar</button>
                  <button onClick={() => setEditandoId(null)}>❌ Cancelar</button>
                </>
              ) : (
                <>
                  <strong>{p.nombre}</strong>
                  <button onClick={() => comenzarEdicion(p)}>✏️ Editar</button>
                  <button onClick={() => onEliminar(p.id)} className="eliminar">🗑️</button>
                </>
              )}

              <div className="esquema-actions">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(p.id, e)}
                />
                <button onClick={() => subirEsquema(p.id)} disabled={loading}>
                  {loading ? "Subiendo..." : "📤 Subir Esquema"}
                </button>
                <button onClick={() => eliminarEsquema(p.id)} className="eliminar">
                  🗑️ Quitar Esquema
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="acciones-finales">
          <button onClick={() => {
            onRecargar?.();
            onClose();
          }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalGestionPlantas;

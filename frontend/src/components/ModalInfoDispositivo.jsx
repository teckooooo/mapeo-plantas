import { useState, useEffect } from "react";
import "./ModalInfoDispositivo.css";

function ModalInfoDispositivo({ visible, onClose, dispositivo, onDelete }) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    ip: "",
    marca: "",
    modelo: "",
    funcion: "",
    etiquetas: "",
    foto: null,
  });

  useEffect(() => {
    if (dispositivo) {
      setForm({
        id: dispositivo.id ?? "",
        nombre: dispositivo.nombre ?? "",
        ip: dispositivo.ip ?? "",
        marca: dispositivo.marca ?? "",
        modelo: dispositivo.modelo ?? "",
        funcion: dispositivo.funcion ?? "",
        etiquetas: dispositivo.etiquetas ?? "",
        foto: dispositivo.foto ?? null,
      });
    }
  }, [dispositivo]);

  if (!visible || !dispositivo) return null;

  const handleDelete = () => {
    if (!window.confirm(`¿Eliminar el dispositivo "${dispositivo.nombre}"?`)) return;

    fetch("http://localhost/mapeo-plantas/backend/api/delete_equipo.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dispositivo.id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onDelete();
          onClose();
        } else {
          alert("Error al eliminar el dispositivo.");
        }
      });
  };

  const handleGuardar = () => {
    fetch("http://localhost/mapeo-plantas/backend/api/update_equipo.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Dispositivo actualizado");
          onClose();
          onDelete(); // para refrescar
        } else {
          alert("Error al guardar");
        }
      });
  };

  return (
    <div className="modal-info-overlay" onClick={onClose}>
      <div className="modal-info" onClick={e => e.stopPropagation()}>
        {form.foto ? (
          <img src={form.foto} alt={form.nombre} className="modal-info-img" />
        ) : (
          <div className="modal-info-img-placeholder">
            📷
            <span style={{ fontSize: "13px", color: "#666" }}>Sin foto disponible</span>
          </div>
        )}

        <div className="modal-info-detalle">
          {modoEdicion ? (
            <>
              <label>Nombre:</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />

              <label>IP:</label>
              <input value={form.ip} onChange={e => setForm({ ...form, ip: e.target.value })} />

              <label>Marca:</label>
              <input value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} />

              <label>Modelo:</label>
              <input value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} />

              <label>Función:</label>
              <input value={form.funcion} onChange={e => setForm({ ...form, funcion: e.target.value })} />

              <label>Etiquetas:</label>
              <input value={form.etiquetas} onChange={e => setForm({ ...form, etiquetas: e.target.value })} />

              <label>Nueva foto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setForm({ ...form, foto: reader.result });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </>
          ) : (
            <>
              <h3>{dispositivo.nombre}</h3>
              {dispositivo.ip && <p><strong>IP:</strong> {dispositivo.ip}</p>}
              {dispositivo.marca && <p><strong>Marca:</strong> {dispositivo.marca}</p>}
              {dispositivo.modelo && <p><strong>Modelo:</strong> {dispositivo.modelo}</p>}
              {dispositivo.funcion && <p><strong>Función:</strong> {dispositivo.funcion}</p>}
              {dispositivo.etiquetas && <p><strong>Etiquetas:</strong> {dispositivo.etiquetas}</p>}
            </>
          )}
        </div>

        <div className="modal-info-botones">
          {modoEdicion ? (
            <>
              <button onClick={() => setModoEdicion(false)}>Cancelar</button>
              <button onClick={handleGuardar} className="guardar">Guardar</button>
            </>
          ) : (
            <>
              <button onClick={onClose}>Cerrar</button>
              <button onClick={() => setModoEdicion(true)}>Editar</button>
              <button onClick={handleDelete} className="peligro">Eliminar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalInfoDispositivo;

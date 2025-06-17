import { useEffect, useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./ModalAgregarEquipo.css";

function ModalAgregarEquipo({
  plantaId,
  visible,
  onClose,
  onSuccess,
  areaPreseleccionada = null,
}) {
  const [racks, setRacks] = useState([]);
  const [rackId, setRackId] = useState("");
  const [nombre, setNombre] = useState("");
  const [ip, setIp] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [funcion, setFuncion] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: "px", width: 100, height: 100 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const imgRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const usandoAreaPreseleccionada = !!areaPreseleccionada;

  useEffect(() => {
    if (plantaId) {
      fetch(`http://localhost/mapeo-plantas/backend/api/get_racks_by_planta.php?planta_id=${plantaId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setRacks(json.data);
          } else {
            console.error("Respuesta inválida del backend:", json);
            setRacks([]);
          }
        })
        .catch(err => {
          console.error("Error al cargar racks:", err);
          setRacks([]);
        });
    }
  }, [plantaId]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const guardarDispositivo = (imagen_id_final) => {
    const rack_id_final = usandoAreaPreseleccionada ? areaPreseleccionada.rack_id : rackId;

    const area_x = usandoAreaPreseleccionada ? areaPreseleccionada.x : Math.round(completedCrop?.x ?? 0);
    const area_y = usandoAreaPreseleccionada ? areaPreseleccionada.y : Math.round(completedCrop?.y ?? 0);
    const area_width = usandoAreaPreseleccionada ? areaPreseleccionada.width : Math.round(completedCrop?.width ?? 0);
    const area_height = usandoAreaPreseleccionada ? areaPreseleccionada.height : Math.round(completedCrop?.height ?? 0);

    fetch("http://localhost/mapeo-plantas/backend/api/create_equipo.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rack_id: rack_id_final,
        nombre,
        ip,
        marca,
        modelo,
        funcion,
        etiquetas,
        foto: null,
        x: area_x,
        y: area_y,
        width: area_width,
        height: area_height,
        imagen_id: imagen_id_final,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onSuccess();
          onClose();
        } else {
          console.error("Respuesta del backend:", data);
          alert("Error al guardar el dispositivo: " + (data.error ?? "sin detalles"));
        }
      })
      .catch(err => {
        console.error("Error en create_equipo.php:", err);
        alert("Ocurrió un error al guardar.");
      });
  };

  const handleSubmit = () => {
    const rack_id_final = usandoAreaPreseleccionada ? areaPreseleccionada.rack_id : rackId;

    if (!rack_id_final || !nombre.trim()) {
      alert("Debes seleccionar un rack y un nombre.");
      return;
    }

    if (usandoAreaPreseleccionada) {
      guardarDispositivo(areaPreseleccionada.imagen_id);
      return;
    }

    const nombre_archivo = `dispositivo_${Date.now()}.jpg`;

    fetch("http://localhost/mapeo-plantas/backend/api/guardar_imagen.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rack_id: rack_id_final,
        nombre_archivo,
        data_larga: imageSrc,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          guardarDispositivo(data.imagen_id);
        } else {
          console.error("Error al guardar imagen:", data);
          alert("Error al guardar imagen del dispositivo.");
        }
      })
      .catch(err => {
        console.error("Error en guardar_imagen.php:", err);
        alert("Error en la subida de imagen.");
      });
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Añadir Dispositivo</h3>

        {!usandoAreaPreseleccionada && (
          <>
            <label>Rack destino:</label>
            <select value={rackId} onChange={e => setRackId(e.target.value)} className="full-width">
              <option value="">-- Selecciona un rack --</option>
              {Array.isArray(racks) && racks.map(r => (
                <option key={r.id} value={r.id}>Rack {r.numero || r.id}</option>
              ))}
            </select>
          </>
        )}

        <label>Nombre:</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)} className="full-width" />

        <label>IP:</label>
        <input value={ip} onChange={e => setIp(e.target.value)} className="full-width" />

        <label>Marca:</label>
        <input value={marca} onChange={e => setMarca(e.target.value)} className="full-width" />

        <label>Modelo:</label>
        <input value={modelo} onChange={e => setModelo(e.target.value)} className="full-width" />

        <label>Función:</label>
        <textarea value={funcion} onChange={e => setFuncion(e.target.value)} className="full-width" />

        <label>Etiquetas:</label>
        <textarea value={etiquetas} onChange={e => setEtiquetas(e.target.value)} className="full-width" />

        {!usandoAreaPreseleccionada && (
          <>
            <label>Foto del dispositivo:</label>
            <input type="file" accept="image/*" onChange={handleImage} />
          </>
        )}

        {usandoAreaPreseleccionada ? (
          <div className="preview-container">
            <img
              ref={imgRef}
              src={areaPreseleccionada?.foto_src}
              alt="Rack seleccionado"
              className="preview-img"
              onLoad={(e) => {
                const naturalWidth = e.currentTarget.naturalWidth;
                const displayedWidth = e.currentTarget.clientWidth;
                setScaleFactor(displayedWidth / naturalWidth);
              }}
            />
            <div
              className="highlight-box"
              style={{
                left: areaPreseleccionada.x * scaleFactor,
                top: areaPreseleccionada.y * scaleFactor,
                width: areaPreseleccionada.width * scaleFactor,
                height: areaPreseleccionada.height * scaleFactor,
              }}
            />
          </div>
        ) : (
          imageSrc && (
            <div style={{ marginTop: "10px" }}>
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={undefined}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="selección"
                  style={{ maxWidth: "100%" }}
                />
              </ReactCrop>
            </div>
          )
        )}

        <div className="btn-footer">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalAgregarEquipo;

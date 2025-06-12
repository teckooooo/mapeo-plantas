import { useState, useRef } from "react";

function ModalAsignarAreas({ visible, rackId, onClose, onSuccess }) {
  const [image, setImage] = useState(null);
  const [areas, setAreas] = useState([]);
  const imgRef = useRef();

  const handleAddArea = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const width = 100;
    const height = 80;

    const nombre = prompt("Nombre del dispositivo:");
    if (!nombre) return;

    setAreas([...areas, { nombre, x, y, width, height }]);
  };

  const handleSubmit = () => {
    fetch("http://localhost/mapeo-plantas/backend/api/guardar_imagen_con_areas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rack_id: rackId,
        foto: image,
        dispositivos: areas
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        alert("Error: " + data.error);
      }
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  if (!visible) return null;

  return (
    <div className="modal">
      <h3>Subir imagen del rack</h3>
      <input type="file" accept="image/*" onChange={handleImage} />

      <div style={{ position: "relative", marginTop: 10 }}>
        {image && (
          <img
            src={image}
            ref={imgRef}
            onClick={handleAddArea}
            alt="rack"
            style={{ width: "100%", maxWidth: "600px" }}
          />
        )}
        {areas.map((a, i) => (
          <div key={i}
            style={{
              position: "absolute",
              top: a.y, left: a.x,
              width: a.width, height: a.height,
              border: "2px dashed red",
              backgroundColor: "rgba(255,0,0,0.2)"
            }}
            title={a.nombre}
          />
        ))}
      </div>

      <button onClick={handleSubmit}>Guardar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}

export default ModalAsignarAreas;

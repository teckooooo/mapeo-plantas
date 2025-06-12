import { useEffect, useState } from "react";

function AgregarRack() {
  const [plantas, setPlantas] = useState([]);
  const [plantaId, setPlantaId] = useState("");
  const [numero, setNumero] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost/mapeo-plantas/backend/api/get_plantas.php")
      .then(res => res.json())
      .then(data => setPlantas(data));
  }, []);

  const agregarRack = () => {
    if (!plantaId || !numero.trim()) {
      setMensaje("Debes seleccionar una planta y asignar un número.");
      return;
    }

    console.log("Enviando:", { planta_id: plantaId, numero, descripcion });

    fetch("http://localhost/mapeo-plantas/backend/api/create_rack.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planta_id: plantaId,
        numero: numero.trim(),
        descripcion: descripcion.trim()
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMensaje("✅ Rack agregado correctamente.");
          setNumero("");
          setDescripcion("");
        } else {
          setMensaje("❌ " + (data.error || "Error al agregar rack."));
        }
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Agregar Rack</h2>

      <label>Planta:</label>
      <select
        value={plantaId}
        onChange={e => setPlantaId(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="">-- Seleccionar --</option>
        {plantas.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <label>Número de Rack:</label>
      <input
        value={numero}
        onChange={e => setNumero(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>Descripción:</label>
      <textarea
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={agregarRack}>Agregar Rack</button>

      <p style={{ marginTop: "10px", color: mensaje.includes("✅") ? "green" : "red" }}>
        {mensaje}
      </p>
    </div>
  );
}

export default AgregarRack;

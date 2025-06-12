function Notificacion({ mensaje, tipo }) {
  const color = tipo === "error" ? "#e74c3c" : "#2ecc71"; // rojo o verde

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: color,
      color: "white",
      padding: "15px 20px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      zIndex: 9999
    }}>
      {mensaje}
    </div>
  );
}

export default Notificacion;

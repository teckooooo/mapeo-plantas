function EsquemaImagen({ plantaNombre, esquemaBase64 }) {
  if (!esquemaBase64) return null;

  return (
    <div style={{ marginTop: "30px" }}>
      <img
        src={esquemaBase64}
        alt={`Esquema ${plantaNombre}`}
        style={{ maxWidth: "50%", border: "1px solid #ccc", borderRadius: "8px" }}
      />
    </div>
  );
}

export default EsquemaImagen;

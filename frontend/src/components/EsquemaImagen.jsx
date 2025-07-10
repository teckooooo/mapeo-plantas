import "./EsquemaImagen.css";

function EsquemaImagen({ plantaNombre, esquemaBase64, anchoPorcentaje, onAumentar, onReducir }) {
  if (!esquemaBase64) return null;

  return (
    <div className="esquema-contenedor">
      <div className="esquema-controles">
        <button onClick={onReducir}>−</button>
        <span>{anchoPorcentaje}%</span>
        <button onClick={onAumentar}>＋</button>
      </div>

      <img
        src={esquemaBase64}
        alt={`Esquema ${plantaNombre}`}
        className="esquema-img"
        style={{ maxWidth: `${anchoPorcentaje}%` }}
      />
    </div>
  );
}

export default EsquemaImagen;

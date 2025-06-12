import plantaDigital from "../assets/esquemas/planta_digital.png";
import plantaAnaloga from "../assets/esquemas/planta_analoga.png";

function EsquemaImagen({ plantaNombre }) {
  let imagen = null;

  if (plantaNombre === "Planta Digital") {
    imagen = plantaDigital;
  } else if (plantaNombre === "Planta Análoga") {
    imagen = plantaAnaloga;
  }

  if (!imagen) return null;

  return (
    <div style={{ marginTop: "30px" }}>
      <img src={imagen} alt={`Esquema ${plantaNombre}`} style={{ maxWidth: "30%", border: "1px solid #ccc" }} />
    </div>
  );
}

export default EsquemaImagen;

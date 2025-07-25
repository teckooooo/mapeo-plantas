import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./dispositivo-info.css";

const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost/mapeo-plantas/backend"
  : "http://192.168.1.152/mapeo-plantas/backend";

function DispositivoInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [equipo, setEquipo] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/api/get_dispositivo_completo.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEquipo(data.equipo);
        }
      })
      .catch(err => {
        console.error("Error al obtener datos:", err);
      });
  }, [id]);

const mostrarEnGrande = (src) => {
  const visor = document.getElementById("visorRecorte");

  const x = Number(equipo.area_x);
  const y = Number(equipo.area_y);
  const w = Number(equipo.area_width);
  const h = Number(equipo.area_height);

  if (!isNaN(x) && !isNaN(y) && w > 0 && h > 0) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

      // Mostrar el recorte en el visor
      visor.style.backgroundImage = `url(${canvas.toDataURL("image/jpeg", 0.95)})`;
      visor.style.width = `${w}px`;
      visor.style.height = `${h}px`;
      visor.style.backgroundPosition = "center";
      visor.style.backgroundRepeat = "no-repeat";
      visor.style.backgroundSize = "contain";
    };
    img.src = src;
  }

  document.getElementById("visorModal").style.display = "flex";
};



  const cerrarVisor = (e) => {
    if (!e || e.target.id === "visorModal" || e.target.classList.contains("cerrar")) {
      document.getElementById("visorModal").style.display = "none";
      document.getElementById("visorImagen").src = "";
    }
  };

  const eliminarFotoAdicional = (fotoId) => {
    if (!window.confirm("¿Eliminar esta foto?")) return;
    fetch(`${BASE_URL}/api/delete_foto_dispositivo.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: fotoId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("✅ Foto eliminada.");
          window.location.reload();
        }
      });
  };

  const agregarFoto = (dispositivoId) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        fetch(`${BASE_URL}/api/agregar_foto_dispositivo.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dispositivo_id: dispositivoId,
            data_larga: reader.result
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert("📸 Foto añadida.");
              window.location.reload();
            }
          });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleGuardar = () => {
    const actualizados = {
      id: equipo.id,
      nombre: document.getElementById("nombre").value.trim(),
      ip: document.getElementById("ip").value.trim(),
      marca: document.getElementById("marca").value.trim(),
      modelo: document.getElementById("modelo").value.trim(),
      funcion: document.getElementById("funcion").value.trim(),
      etiquetas: document.getElementById("etiquetas").value.trim(),
      foto: equipo.foto || null,
    };

    fetch(`${BASE_URL}/api/update_equipo.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizados),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("✅ Cambios guardados.");
          setModoEdicion(false);
          setEquipo({ ...equipo, ...actualizados });
        }
      });
  };

  const handleEliminar = () => {
    if (!window.confirm("¿Eliminar el dispositivo completo?")) return;

    fetch(`${BASE_URL}/api/delete_equipo.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("✅ Dispositivo eliminado.");
          navigate("/");
        }
      });
  };

  if (!equipo) return <div className="info-dispositivo">Cargando o no encontrado...</div>;

  return (
    <div className="contenedor-horizontal">
      <div className="info-dispositivo">
        <div id="visorModal" onClick={cerrarVisor} style={{ display: "none" }}>
          <span className="cerrar">✖</span>
          <div id="visorRecorte"></div>
        </div>

        {modoEdicion ? (
          <>
            <h2>Editar Dispositivo</h2>
            <div className="campo"><strong>Nombre:</strong> <input id="nombre" defaultValue={equipo.nombre} /></div>
            <div className="campo"><strong>IP:</strong> <input id="ip" defaultValue={equipo.ip || ""} /></div>
            <div className="campo"><strong>Marca:</strong> <input id="marca" defaultValue={equipo.marca || ""} /></div>
            <div className="campo"><strong>Modelo:</strong> <input id="modelo" defaultValue={equipo.modelo || ""} /></div>
            <div className="campo"><strong>Función:</strong> <textarea id="funcion" defaultValue={equipo.funcion || ""} /></div>
            <div className="campo"><strong>Etiquetas:</strong> <textarea id="etiquetas" defaultValue={equipo.etiquetas || ""} /></div>
            <div className="acciones">
              <button onClick={handleGuardar}>💾 Guardar</button>
              <button onClick={() => setModoEdicion(false)}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <h2>Información del Dispositivo</h2>
            <div className="campo"><strong>Nombre:</strong> {equipo.nombre}</div>
            <div className="campo"><strong>IP:</strong> {equipo.ip || "—"}</div>
            <div className="campo"><strong>Marca:</strong> {equipo.marca || "—"}</div>
            <div className="campo"><strong>Modelo:</strong> {equipo.modelo || "—"}</div>
            <div className="campo"><strong>Función:</strong> {equipo.funcion || "—"}</div>
            <div className="campo"><strong>Etiquetas:</strong> {equipo.etiquetas || "—"}</div>
            <div className="acciones">
              <button onClick={() => setModoEdicion(true)}>📝 Editar</button>
              <button onClick={handleEliminar}>🗑️ Eliminar</button>
              <button onClick={() => agregarFoto(equipo.id)}>📷 Agregar Foto</button>
            </div>
          </>
        )}
      </div>

<div className="galeria-fotos">
  {(equipo.foto && equipo.area_x && equipo.area_y && equipo.area_width && equipo.area_height) ? (
    <div
      className="foto-recortada"
      onClick={() => mostrarEnGrande(equipo.foto)}
      style={{
        backgroundImage: `url(${equipo.foto})`,
        backgroundPosition: `-${equipo.area_x}px -${equipo.area_y}px`,
        backgroundSize: "auto",
        width: `${equipo.area_width}px`,
        height: `${equipo.area_height}px`
      }}
    ></div>
  ) : (
    equipo.foto && (
      <img
        className="imagen-dispositivo"
        src={equipo.foto}
        onClick={() => mostrarEnGrande(equipo.foto)}
        alt="Foto del dispositivo"
      />
    )
  )}

  {/* imágenes adicionales */}
  <div className="fotos-adicionales">
    {(equipo.fotos_adicionales || []).map((f) => (
      <div key={f.id} className="foto-adicional">
        <img src={f.ruta} onClick={() => mostrarEnGrande(f.ruta)} />
        <button className="btn-eliminar-foto" onClick={() => eliminarFotoAdicional(f.id)}>✖</button>
      </div>
    ))}
  </div>
</div>


    </div>
  );
}

export default DispositivoInfo;

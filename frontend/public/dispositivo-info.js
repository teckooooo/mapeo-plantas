const id = new URLSearchParams(window.location.search).get("id");
let dispositivoData = null;
let modoEdicion = false;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("visorModal").addEventListener("click", cerrarVisor);

  if (!id) {
    document.getElementById("info").innerText = "ID no especificado.";
  } else {
    fetch(`http://localhost/mapeo-plantas/backend/api/get_dispositivo_completo.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispositivoData = data.equipo;
          renderVista(dispositivoData);
        } else {
          document.getElementById("info").innerText = "Dispositivo no encontrado.";
        }
      })
      .catch(err => {
        console.error("Error al obtener datos:", err);
        document.getElementById("info").innerText = "⚠️ Error al cargar datos.";
      });
  }
});

function renderVista(data) {
  const infoContenedor = document.getElementById("info");
  let contenidoHTML = "";

  if (modoEdicion) {
    contenidoHTML = `
      <div class="campo"><strong>Nombre:</strong> <input id="nombre" value="${data.nombre}"></div>
      <div class="campo"><strong>IP:</strong> <input id="ip" value="${data.ip || ""}"></div>
      <div class="campo"><strong>Marca:</strong> <input id="marca" value="${data.marca || ""}"></div>
      <div class="campo"><strong>Modelo:</strong> <input id="modelo" value="${data.modelo || ""}"></div>
      <div class="campo"><strong>Función:</strong> <textarea id="funcion">${data.funcion || ""}</textarea></div>
      <div class="campo"><strong>Etiquetas:</strong> <textarea id="etiquetas">${data.etiquetas || ""}</textarea></div>
      <div class="acciones">
        <button class="btn-guardar">💾 Guardar</button>
        <button class="btn-cancelar">Cancelar</button>
      </div>
    `;
  } else {
    contenidoHTML = `
      <h2>Información del Dispositivo</h2>
      <div class="campo"><strong>Nombre:</strong> ${data.nombre}</div>
      <div class="campo"><strong>IP:</strong> ${data.ip || "—"}</div>
      <div class="campo"><strong>Marca:</strong> ${data.marca || "—"}</div>
      <div class="campo"><strong>Modelo:</strong> ${data.modelo || "—"}</div>
      <div class="campo"><strong>Función:</strong> ${data.funcion || "—"}</div>
      <div class="campo"><strong>Etiquetas:</strong> ${data.etiquetas || "—"}</div>
      <div class="acciones">
        <button class="btn-editar">📝 Editar</button>
        <button class="btn-eliminar">🗑️ Eliminar</button>
        <button class="btn-subir">📷 Agregar Foto</button>
      </div>
    `;
  }

  infoContenedor.innerHTML = contenidoHTML;

  if (modoEdicion) {
    document.querySelector(".btn-guardar")?.addEventListener("click", () => guardarCambios(data.id));
    document.querySelector(".btn-cancelar")?.addEventListener("click", cancelarEdicion);
  } else {
    document.querySelector(".btn-editar")?.addEventListener("click", activarEdicion);
    document.querySelector(".btn-eliminar")?.addEventListener("click", () => eliminarDispositivo(data.id));
    document.querySelector(".btn-subir")?.addEventListener("click", () => agregarFoto(data.id));
  }

  const galeria = document.getElementById("galeria");
  galeria.innerHTML = "";

  if (data.foto) {
    const img = document.createElement("img");
    img.src = data.foto;
    img.className = "foto-principal";
    img.onclick = () => mostrarEnGrande(img.src);
    galeria.appendChild(img);
  }

  const contenedorExtras = document.createElement("div");
  contenedorExtras.className = "fotos-adicionales";

  (data.fotos_adicionales || []).forEach(f => {
    const wrapper = document.createElement("div");
    wrapper.className = "foto-adicional";

    const img = document.createElement("img");
    img.src = f.ruta;
    img.onclick = () => mostrarEnGrande(f.ruta);

    const btn = document.createElement("button");
    btn.className = "btn-eliminar-foto";
    btn.innerText = "✖";
    btn.onclick = () => eliminarFotoAdicional(f.id);

    wrapper.appendChild(img);
    wrapper.appendChild(btn);
    contenedorExtras.appendChild(wrapper);
  });

  galeria.appendChild(contenedorExtras);
}

function mostrarEnGrande(src) {
  document.getElementById("visorImagen").src = src;
  document.getElementById("visorModal").style.display = "flex";
}

function cerrarVisor(e) {
  if (!e || e.target.id === "visorModal" || e.target.classList.contains("cerrar")) {
    document.getElementById("visorModal").style.display = "none";
    document.getElementById("visorImagen").src = "";
  }
}

function eliminarFotoAdicional(fotoId) {
  if (!window.confirm("¿Eliminar esta foto?")) return;

  fetch("http://localhost/mapeo-plantas/backend/api/delete_foto_dispositivo.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: fotoId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Foto eliminada.");
        window.location.reload();
      } else {
        alert("❌ No se pudo eliminar.");
      }
    })
    .catch(err => {
      console.error("Error al eliminar foto:", err);
      alert("⚠️ Error de red.");
    });
}

function eliminarDispositivo(id) {
  if (!window.confirm("¿Eliminar el dispositivo completo?")) return;

  fetch("http://localhost/mapeo-plantas/backend/api/delete_equipo.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Dispositivo eliminado.");
        window.location.href = "index.html";
      } else {
        alert("❌ Error al eliminar.");
      }
    })
    .catch(err => {
      console.error("Error al eliminar dispositivo:", err);
      alert("⚠️ Error de red.");
    });
}

function activarEdicion() {
  modoEdicion = true;
  renderVista(dispositivoData);
}

function cancelarEdicion() {
  modoEdicion = false;
  renderVista(dispositivoData);
}

function guardarCambios(id) {
  const actualizados = {
    id,
    nombre: document.getElementById("nombre").value.trim(),
    ip: document.getElementById("ip").value.trim(),
    marca: document.getElementById("marca").value.trim(),
    modelo: document.getElementById("modelo").value.trim(),
    funcion: document.getElementById("funcion").value.trim(),
    etiquetas: document.getElementById("etiquetas").value.trim(),
    foto: dispositivoData.foto || null
  };

  fetch("http://localhost/mapeo-plantas/backend/api/update_equipo.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actualizados)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Cambios guardados.");
        modoEdicion = false;
        dispositivoData = { ...dispositivoData, ...actualizados };
        renderVista(dispositivoData);
      } else {
        alert("❌ Error al guardar cambios.");
      }
    })
    .catch(err => {
      console.error("Error al guardar cambios:", err);
      alert("⚠️ Error de red.");
    });
}

function agregarFoto(dispositivoId) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = () => {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      fetch("http://localhost/mapeo-plantas/backend/api/agregar_foto_dispositivo.php", {
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
          } else {
            alert("❌ Error al subir.");
          }
        })
        .catch(err => {
          console.error("Error al subir imagen:", err);
          alert("⚠️ Error de red.");
        });
    };
    reader.readAsDataURL(file);
  };

  input.click();
}

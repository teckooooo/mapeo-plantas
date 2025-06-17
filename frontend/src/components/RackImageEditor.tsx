import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { Rnd } from "react-rnd";
import "./RackImageEditor.css";

interface Dispositivo {
  id?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  nombre?: string;
}

interface Props {
  foto: { src: string };
  dispositivos: Dispositivo[];
  onNuevaArea: (area: Omit<Dispositivo, "id"> & { imagen_id: number; foto_src: string }) => void;

  imagenId: number;
}

function RackImageEditor({ foto, dispositivos = [], onNuevaArea, imagenId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<Omit<Dispositivo, "id"> | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [localDispositivos, setLocalDispositivos] = useState(dispositivos);

  useEffect(() => {
    setLocalDispositivos(dispositivos);
  }, [dispositivos]);

  useEffect(() => {
    const img = containerRef.current?.querySelector("img");
    if (!img) return;

    const updateScale = () => {
      const ratioX = img.clientWidth / img.naturalWidth;
      const ratioY = img.clientHeight / img.naturalHeight;
      setScale({ x: ratioX, y: ratioY });
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(img);
    return () => observer.disconnect();
  }, []);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!(e.button === 0 && e.shiftKey)) return;

    e.preventDefault();
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = (e.clientX - bounds.left) / scale.x;
    const y = (e.clientY - bounds.top) / scale.y;

    setStart({ x, y });
    setDrawing(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!drawing || !start) return;

    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = (e.clientX - bounds.left) / scale.x;
    const y = (e.clientY - bounds.top) / scale.y;

    setCurrentBox({
      x: Math.min(start.x, x),
      y: Math.min(start.y, y),
      width: Math.abs(x - start.x),
      height: Math.abs(y - start.y),
    });
  };

  const handleMouseUp = () => {
    if (drawing && currentBox) {
      onNuevaArea({ ...currentBox, imagen_id: imagenId, foto_src: foto.src });

    }
    setDrawing(false);
    setStart(null);
    setCurrentBox(null);
  };

  const handleSaveUpdate = (id: number, newPos: Partial<Dispositivo>) => {
    fetch("http://localhost/mapeo-plantas/backend/api/update_equipo_posicion.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...newPos }),
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (!data.success) {
            console.error("❌ Error en respuesta JSON:", data);
          }
        } catch (err) {
          console.error("❌ Respuesta no es JSON válido:", text);
        }
      })
      .catch((err) => {
        console.error("❌ Error de red al guardar posición:", err);
      });
  };

  return (
    <div
      className="rack-editor"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {foto?.src ? (
        <img
          src={foto.src}
          alt="Rack"
          className="rack-image"
          onError={(e) => {
            console.error("❌ Imagen no cargó correctamente:", foto.src);
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="no-image">Imagen no disponible</div>
      )}

      {editingId && (
        <button
          className="salir-edicion"
          onClick={() => setEditingId(null)}
        >
          Salir de edición ✖
        </button>
      )}

      {localDispositivos.map((d, i) => (
        <Rnd
          key={d.id ?? `temp-${i}`}
          size={{ width: d.width * scale.x, height: d.height * scale.y }}
          position={{ x: d.x * scale.x, y: d.y * scale.y }}
          enableResizing={d.id === editingId}
          disableDragging={d.id !== editingId}
          onClick={(e) => {
            if (e.ctrlKey && d.id) {
              e.stopPropagation();
              setEditingId(d.id);
            } else if (d.id && d.id !== editingId) {
              window.open(`/dispositivo-info.html?id=${d.id}`, "_blank");
            }
          }}
          onResizeStop={(e, dir, ref, delta, pos) => {
            if (d.id === editingId) {
              const updated = {
                ...d,
                x: pos.x / scale.x,
                y: pos.y / scale.y,
                width: ref.offsetWidth / scale.x,
                height: ref.offsetHeight / scale.y,
              };
              setLocalDispositivos((prev) =>
                prev.map((item) => (item.id === d.id ? updated : item))
              );
              handleSaveUpdate(d.id, updated);
            }
          }}
          onDragStop={(e, data) => {
            if (d.id === editingId) {
              const updated = {
                ...d,
                x: data.x / scale.x,
                y: data.y / scale.y,
              };
              setLocalDispositivos((prev) =>
                prev.map((item) => (item.id === d.id ? { ...item, ...updated } : item))
              );
              handleSaveUpdate(d.id, updated);
            }
          }}
          style={{
            position: "absolute",
            border: d.id === editingId ? "2px solid green" : "2px dashed blue",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            cursor: "pointer",
          }}
        />
      ))}

      {currentBox && (
        <div
          className="drawing-box"
          style={{
            left: currentBox.x * scale.x,
            top: currentBox.y * scale.y,
            width: currentBox.width * scale.x,
            height: currentBox.height * scale.y,
          }}
        />
      )}
    </div>
  );
}

export default RackImageEditor;

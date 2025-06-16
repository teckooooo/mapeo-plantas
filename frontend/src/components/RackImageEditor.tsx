import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { Rnd } from "react-rnd";

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
  onNuevaArea: (area: Omit<Dispositivo, "id"> & { imagen_id: number }) => void;
  imagenId: number;
}

function RackImageEditor({ foto, dispositivos = [], onNuevaArea, imagenId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<Omit<Dispositivo, "id"> | null>(null);
  const [dispositivosTemporales, setDispositivosTemporales] = useState<Dispositivo[]>([]);

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
    if (e.button !== 2) return; // Solo click derecho
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
      onNuevaArea({ ...currentBox, imagen_id: imagenId });
    }

    setDrawing(false);
    setStart(null);
    setCurrentBox(null);
  };

  const todosLosDispositivos = [...dispositivos, ...dispositivosTemporales];

  return (
    <div
      className="rack-editor"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "relative",
        cursor: drawing ? "crosshair" : "default",
        userSelect: "none"
      }}
    >
      {/* Imagen base64 */}
      {foto?.src ? (
        <img
  src={foto.src}
  alt="Rack"
  style={{
    width: "100%",
    display: "block",
    maxWidth: "100%",
    maxHeight: "auto",
    objectFit: "contain",
    border: "1px solid #ccc",
  }}
  onError={(e) => {
    console.error("❌ Imagen no cargó correctamente:", foto.src);
    (e.target as HTMLImageElement).style.display = "none";
  }}
/>

      ) : (
        <div style={{ padding: 20, color: "gray" }}>Imagen no disponible</div>
      )}

      {/* Dispositivos existentes */}
      {todosLosDispositivos.map((d, i) => (
        <Rnd
  key={d.id ?? `temp-${i}`}
  size={{
    width: d.width * scale.x,
    height: d.height * scale.y,
  }}
  position={{
    x: d.x * scale.x,
    y: d.y * scale.y,
  }}
  enableResizing={false}
  disableDragging
  onClick={() => {
    if (d.id) {
      window.open(`/dispositivo-info.html?id=${d.id}`, "_blank");
    }
  }}
  style={{
    position: "absolute",
    border: "2px dashed blue",
    backgroundColor: "rgba(0, 0, 255, 0.1)",
    cursor: d.id ? "pointer" : "default"
  }}
/>

      ))}

      {/* Caja temporal mientras se dibuja */}
      {currentBox && (
        <div
          style={{
            position: "absolute",
            left: currentBox.x * scale.x,
            top: currentBox.y * scale.y,
            width: currentBox.width * scale.x,
            height: currentBox.height * scale.y,
            border: "2px dashed red",
            backgroundColor: "rgba(255,0,0,0.1)",
            pointerEvents: "none",
            zIndex: 9999
          }}
        />
      )}
    </div>
  );
}

export default RackImageEditor;

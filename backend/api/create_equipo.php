<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Función para responder siempre en JSON
function responder($data) {
  echo json_encode($data);
  exit;
}

try {
  // Leer y decodificar JSON
  $data = json_decode(file_get_contents("php://input"), true);

  // Validación básica
  if (!$data || !isset($data['rack_id'], $data['nombre'])) {
    responder(["success" => false, "error" => "Rack y nombre son obligatorios"]);
  }

  // Capturar campos
  $rack_id     = $data['rack_id'];
  $nombre      = $data['nombre'];
  $ip          = $data['ip'] ?? "";
  $marca       = $data['marca'] ?? "";
  $modelo      = $data['modelo'] ?? "";
  $funcion     = $data['funcion'] ?? "";
  $etiquetas   = $data['etiquetas'] ?? "";
  $foto        = isset($data['foto']) ? $data['foto'] : null;
  $imagen_id   = $data['imagen_id'] ?? null;

  $area_x      = $data['x'] ?? 0;
  $area_y      = $data['y'] ?? 0;
  $area_width  = $data['width'] ?? 0;
  $area_height = $data['height'] ?? 0;

  if (!$imagen_id) {
  responder(["success" => false, "error" => "imagen_id es null"]);
}

  $sql = "INSERT INTO equipos (
    imagen_id, nombre, ip, marca, modelo, funcion, etiquetas, foto,
    area_x, area_y, area_width, area_height, rack_id
  ) VALUES (
    :imagen_id, :nombre, :ip, :marca, :modelo, :funcion, :etiquetas, :foto,
    :x, :y, :width, :height, :rack_id
  )";

  $stmt = $pdo->prepare($sql);
  $success = $stmt->execute([
    ':imagen_id' => $imagen_id,
    ':nombre' => $nombre,
    ':ip' => $ip,
    ':marca' => $marca,
    ':modelo' => $modelo,
    ':funcion' => $funcion,
    ':etiquetas' => $etiquetas,
    ':foto' => $foto,
    ':x' => $area_x,
    ':y' => $area_y,
    ':width' => $area_width,
    ':height' => $area_height,
    ':rack_id' => $rack_id
  ]);

  if ($success) {
    responder(["success" => true, "id" => $pdo->lastInsertId()]);
  } else {
    responder(["success" => false, "error" => $stmt->errorInfo()]);
  }

} catch (Throwable $e) {
  responder([
    "success" => false,
    "error" => "Excepción: " . $e->getMessage()
  ]);
}

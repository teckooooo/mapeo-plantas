<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Leer y decodificar JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validación de campos obligatorios
if (!$data || !isset($data['rack_id'], $data['nombre'])) {
  echo json_encode(["success" => false, "error" => "Rack y nombre son obligatorios"]);
  exit;
}

// Capturar campos
$rack_id     = $data['rack_id'];
$nombre      = $data['nombre'];
$ip          = $data['ip'] ?? "";
$marca       = $data['marca'] ?? "";
$modelo      = $data['modelo'] ?? "";
$funcion     = $data['funcion'] ?? "";
$etiquetas   = $data['etiquetas'] ?? "";
$foto        = $data['foto'] ?? null;

$area_x      = $data['x'] ?? 0;
$area_y      = $data['y'] ?? 0;
$area_width  = $data['width'] ?? 0;
$area_height = $data['height'] ?? 0;

// Validar tipo de imagen base64 (opcional)
if ($foto && !preg_match('/^data:image\/(png|jpeg|jpg);base64,/', $foto)) {
  echo json_encode(["success" => false, "error" => "Formato de imagen no válido"]);
  exit;
}

// Insertar dispositivo
$sql = "INSERT INTO equipos (
  rack_id, nombre, ip, marca, modelo, funcion, etiquetas, foto,
  area_x, area_y, area_width, area_height
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $pdo->prepare($sql);

if (!$stmt) {
  echo json_encode(["success" => false, "error" => "Error en prepare()"]);
  exit;
}

$success = $stmt->execute([
  $rack_id, $nombre, $ip, $marca, $modelo, $funcion, $etiquetas, $foto,
  $area_x, $area_y, $area_width, $area_height
]);

if ($success) {
  echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
} else {
  $error = $stmt->errorInfo();
  echo json_encode(["success" => false, "error" => $error]);
}

<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$rack_id = $data['rack_id'] ?? null;
$nombre_archivo = $data['nombre_archivo'] ?? null;
$base64_raw = explode(',', $data['data_larga'])[1]; 
$data_larga = base64_decode($base64_raw);


if (!$rack_id || !$nombre_archivo || !$data_larga) {
  echo json_encode(["success" => false, "error" => "Datos incompletos"]);
  exit;
}

$sql = "INSERT INTO imagenes (rack_id, nombre_archivo, data_larga) VALUES (?, ?, ?)";
$stmt = $pdo->prepare($sql);

if ($stmt->execute([$rack_id, $nombre_archivo, $data_larga])) {
  echo json_encode(["success" => true, "imagen_id" => $pdo->lastInsertId()]);
} else {
  echo json_encode(["success" => false, "error" => $stmt->errorInfo()]);
}

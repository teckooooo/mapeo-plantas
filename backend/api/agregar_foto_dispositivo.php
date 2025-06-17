<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Permitir manejo de preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['dispositivo_id'], $data['data_larga'])) {
  echo json_encode(["success" => false, "error" => "Datos incompletos"]);
  exit;
}

$base64 = preg_replace('#^data:image/\w+;base64,#i', '', $data['data_larga']);
$binario = base64_decode($base64);

$stmt = $pdo->prepare("INSERT INTO fotos_dispositivo (dispositivo_id, data_larga) VALUES (?, ?)");
$exito = $stmt->execute([$data['dispositivo_id'], $binario]);

echo json_encode(["success" => $exito]);

<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejo preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
  echo json_encode(["success" => false, "error" => "ID de foto no recibido"]);
  exit;
}

$stmt = $pdo->prepare("DELETE FROM fotos_dispositivo WHERE id = ?");
$success = $stmt->execute([$data['id']]);

echo json_encode(["success" => $success]);

<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['rack_id'])) {
  echo json_encode(["success" => false, "error" => "ID faltante"]);
  exit;
}

// Primero elimina los dispositivos asociados (si los hay)
$pdo->prepare("DELETE FROM equipos WHERE rack_id = ?")->execute([$data['rack_id']]);

// Luego elimina el rack
$stmt = $pdo->prepare("DELETE FROM racks WHERE id = ?");
$success = $stmt->execute([$data['rack_id']]);

echo json_encode(["success" => $success]);

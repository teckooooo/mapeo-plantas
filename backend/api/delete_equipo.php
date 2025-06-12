<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
  echo json_encode(["success" => false, "error" => "ID faltante"]);
  exit;
}

$stmt = $pdo->prepare("DELETE FROM equipos WHERE id = ?");
$success = $stmt->execute([$data['id']]);

echo json_encode(["success" => $success]);

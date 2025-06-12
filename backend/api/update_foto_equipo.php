<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$foto = $data['foto'] ?? null;

if (!$id || !$foto) {
  echo json_encode(["success" => false, "error" => "Datos incompletos"]);
  exit;
}

$stmt = $pdo->prepare("UPDATE equipos SET foto = ? WHERE id = ?");
$success = $stmt->execute([$foto, $id]);

echo json_encode(["success" => $success]);

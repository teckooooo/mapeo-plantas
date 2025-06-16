<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$imagen_id = $data["imagen_id"] ?? null;

if (!$imagen_id) {
  echo json_encode(["success" => false, "error" => "ID de imagen no recibido"]);
  exit;
}

try {
  $stmt = $pdo->prepare("DELETE FROM imagenes WHERE id = ?");
  $stmt->execute([$imagen_id]);
  echo json_encode(["success" => true]);
} catch (Exception $e) {
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

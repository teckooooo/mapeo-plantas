<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['rack_id'], $data['orden']) || !is_array($data['orden'])) {
  echo json_encode(["success" => false, "error" => "Datos incompletos"]);
  exit;
}

$rack_id = $data['rack_id'];
$orden = $data['orden'];

try {
  $pdo->beginTransaction();
  foreach ($orden as $posicion => $equipo_id) {
    $stmt = $pdo->prepare("UPDATE equipos SET posicion = ? WHERE id = ? AND rack_id = ?");
    $stmt->execute([$posicion, $equipo_id, $rack_id]);
  }
  $pdo->commit();
  echo json_encode(["success" => true]);
} catch (Exception $e) {
  $pdo->rollBack();
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

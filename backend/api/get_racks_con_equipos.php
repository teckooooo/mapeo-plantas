<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$planta_id = $_GET['planta_id'] ?? null;

if (!$planta_id) {
  echo json_encode(["success" => false, "error" => "Falta planta_id"]);
  exit;
}

try {
  $stmt = $pdo->prepare("SELECT * FROM racks WHERE planta_id = ?");
  $stmt->execute([$planta_id]);
  $racks = $stmt->fetchAll(PDO::FETCH_ASSOC);

  foreach ($racks as &$rack) {
    // Obtener equipos del rack
    $stmt2 = $pdo->prepare("
      SELECT 
        id, nombre, ip, foto,
        area_x AS x,
        area_y AS y,
        area_width AS width,
        area_height AS height
      FROM equipos
      WHERE rack_id = ?
    ");
    $stmt2->execute([$rack['id']]);
    $equipos = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    $rack['equipos'] = $equipos;

    // Usar la primera imagen de los equipos como imagen del rack (si existe)
    $rack['foto'] = null;
    foreach ($equipos as $e) {
      if (!empty($e['foto'])) {
        $rack['foto'] = $e['foto'];
        break;
      }
    }
  }

  echo json_encode($racks);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}

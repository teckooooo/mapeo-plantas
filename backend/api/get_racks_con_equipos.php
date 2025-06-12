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
    // ✅ Obtener la imagen BLOB del rack y codificarla como base64
    $stmtImg = $pdo->prepare("SELECT data_larga FROM imagenes WHERE rack_id = ? ORDER BY id DESC LIMIT 1");
    $stmtImg->execute([$rack['id']]);
    $imagenBinaria = $stmtImg->fetchColumn();
    $rack['foto'] = $imagenBinaria ? 'data:image/jpeg;base64,' . base64_encode($imagenBinaria) : null;

    // ✅ Obtener equipos con coordenadas para renderizado en frontend
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
    $rack['equipos'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);
  }

  echo json_encode($racks);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}

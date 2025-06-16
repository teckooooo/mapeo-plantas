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
    // Obtener imágenes del rack
    $stmtImg = $pdo->prepare("SELECT id, nombre_archivo, data_larga FROM imagenes WHERE rack_id = ?");
    $stmtImg->execute([$rack['id']]);
    $imagenes = $stmtImg->fetchAll(PDO::FETCH_ASSOC);

    // Convertir imágenes a base64
    $rack['fotos'] = array_map(function ($img) {
      return [
        'id' => $img['id'],
        'src' => $img['data_larga'],
        'nombre_archivo' => $img['nombre_archivo']
      ];
    }, $imagenes);

    // Obtener equipos del rack
    $stmtEq = $pdo->prepare("
      SELECT 
        id, imagen_id, nombre, ip, marca, modelo, funcion, etiquetas,
        area_x AS x, area_y AS y, area_width AS width, area_height AS height
      FROM equipos
      WHERE rack_id = ?
    ");
    $stmtEq->execute([$rack['id']]);
    $rack['equipos'] = $stmtEq->fetchAll(PDO::FETCH_ASSOC);
  }

  echo json_encode($racks);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}

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
    // Obtener todos los equipos del rack
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
    $rack['equipos'] = [];

    $fotosAgrupadas = [];
    $fotoIds = [];

    foreach ($equipos as $equipo) {
      $hash = md5($equipo['foto'] ?? ''); // prevenir error si es null

      if (!isset($fotosAgrupadas[$hash])) {
        $fotoIds[$hash] = count($fotoIds) + 1;
        $fotosAgrupadas[$hash] = [
          'id' => $fotoIds[$hash],
          'src' => $equipo['foto'],
          'equipos' => []
        ];
      }

      $fotosAgrupadas[$hash]['equipos'][] = [
        'id' => $equipo['id'],
        'nombre' => $equipo['nombre'],
        'ip' => $equipo['ip'],
        'x' => $equipo['x'],
        'y' => $equipo['y'],
        'width' => $equipo['width'],
        'height' => $equipo['height'],
        'imagen_id' => $fotoIds[$hash]
      ];
    }

    $rack['fotos'] = array_values(array_map(function ($f) {
      return ['id' => $f['id'], 'src' => $f['src']];
    }, $fotosAgrupadas));

    $rack['equipos'] = array_merge(...array_column($fotosAgrupadas, 'equipos'));
  }

  $json = json_encode($racks);
  if ($json === false) {
    echo json_encode([
      "success" => false,
      "error" => "Error al convertir a JSON",
      "json_error" => json_last_error_msg()
    ]);
    exit;
  }

  echo $json;
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}

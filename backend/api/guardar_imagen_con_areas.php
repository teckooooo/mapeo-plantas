<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['rack_id'], $data['foto'], $data['equipos'])) {
  echo json_encode(["success" => false, "error" => "Datos incompletos"]);
  exit;
}

$pdo->beginTransaction();

try {
  // Guardar la imagen del rack
  $stmt = $pdo->prepare("INSERT INTO rack_imagenes (rack_id, foto) VALUES (?, ?)");
  $stmt->execute([$data['rack_id'], $data['foto']]);
  $imagen_id = $pdo->lastInsertId();

  // Guardar dispositivos asociados a la imagen
  foreach ($data['dispositivos'] as $d) {
    $stmt = $pdo->prepare("INSERT INTO equipos (rack_imagen_id, nombre, x, y, width, height)
                          VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$imagen_id, $d['nombre'], $d['x'], $d['y'], $d['width'], $d['height']]);
  }

  $pdo->commit();
  echo json_encode(["success" => true]);

} catch (PDOException $e) {
  $pdo->rollBack();
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

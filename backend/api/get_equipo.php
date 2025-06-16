<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$id = $_GET['id'] ?? null;

if (!$id) {
  echo json_encode(["success" => false, "error" => "ID no especificado"]);
  exit;
}

$stmt = $pdo->prepare("SELECT * FROM equipos WHERE id = ?");
$stmt->execute([$id]);
$equipo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$equipo) {
  echo json_encode(["success" => false, "error" => "Dispositivo no encontrado"]);
  exit;
}

// Si hay imagen_id asociado, cargar la imagen
if ($equipo['imagen_id']) {
  $stmtImg = $pdo->prepare("SELECT data_larga FROM imagenes WHERE id = ?");
  $stmtImg->execute([$equipo['imagen_id']]);
  $imagen = $stmtImg->fetch(PDO::FETCH_ASSOC);

  if ($imagen && $imagen['data_larga']) {
    $equipo['foto'] = 'data:image/jpeg;base64,' . base64_encode($imagen['data_larga']);
  } else {
    $equipo['foto'] = null;
  }
} else {
  $equipo['foto'] = null;
}

echo json_encode($equipo);

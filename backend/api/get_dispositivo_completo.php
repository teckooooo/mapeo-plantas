<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$id = $_GET['id'] ?? null;

if (!$id) {
  echo json_encode(["success" => false, "error" => "ID no especificado"]);
  exit;
}

// Obtener equipo
$stmt = $pdo->prepare("SELECT * FROM equipos WHERE id = ?");
$stmt->execute([$id]);
$equipo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$equipo) {
  echo json_encode(["success" => false, "error" => "Dispositivo no encontrado"]);
  exit;
}

// Convertir campos de coordenadas a enteros si existen
foreach (['x', 'y', 'width', 'height'] as $key) {
  if (isset($equipo[$key])) {
    $equipo[$key] = (int) $equipo[$key];
  } else {
    $equipo[$key] = null;
  }
}

// Obtener imagen principal si existe
if (!empty($equipo['imagen_id'])) {
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

// Obtener fotos adicionales
$stmtExtras = $pdo->prepare("SELECT id, data_larga FROM fotos_dispositivo WHERE dispositivo_id = ?");
$stmtExtras->execute([$id]);
$fotos = $stmtExtras->fetchAll(PDO::FETCH_ASSOC);

// Convertir imágenes a base64
foreach ($fotos as &$foto) {
  $foto['ruta'] = 'data:image/jpeg;base64,' . base64_encode($foto['data_larga']);
  unset($foto['data_larga']);
}

echo json_encode([
  "success" => true,
  "equipo" => $equipo + ["fotos_adicionales" => $fotos]
]);

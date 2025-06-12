<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$targetDir = "../../public/fotos_equipo/";
if (!file_exists($targetDir)) {
  mkdir($targetDir, 0755, true);
}

if (!isset($_FILES['foto']) || !isset($_POST['equipo_id'])) {
  echo json_encode(["success" => false, "error" => "Faltan datos"]);
  exit;
}

$equipo_id = $_POST['equipo_id'];
$file = $_FILES['foto'];
$filename = uniqid() . "_" . basename($file["name"]);
$targetFile = $targetDir . $filename;

if (move_uploaded_file($file["tmp_name"], $targetFile)) {
  require_once '../config/db.php';
  $stmt = $pdo->prepare("UPDATE equipos SET foto = ? WHERE id = ?");
  $stmt->execute(["fotos_equipo/" . $filename, $equipo_id]);
  echo json_encode(["success" => true, "path" => "fotos_equipo/" . $filename]);
} else {
  echo json_encode(["success" => false, "error" => "No se pudo subir"]);
}

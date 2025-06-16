<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
  echo json_encode(["success" => false, "error" => "ID no recibido"]);
  exit;
}

$id = $data['id'];
$nombre = $data['nombre'] ?? "";
$ip = $data['ip'] ?? "";
$marca = $data['marca'] ?? "";
$modelo = $data['modelo'] ?? "";
$funcion = $data['funcion'] ?? "";
$etiquetas = $data['etiquetas'] ?? "";
$foto = $data['foto'] ?? null;

// SQL dinámico para conservar imagen si no se edita
$sql = "UPDATE equipos SET nombre = ?, ip = ?, marca = ?, modelo = ?, funcion = ?, etiquetas = ?";
$params = [$nombre, $ip, $marca, $modelo, $funcion, $etiquetas];

if ($foto !== null) {
  $sql .= ", foto = ?";
  $params[] = $foto;
}

$sql .= " WHERE id = ?";
$params[] = $id;

$stmt = $pdo->prepare($sql);
$success = $stmt->execute($params);

echo json_encode(["success" => $success]);

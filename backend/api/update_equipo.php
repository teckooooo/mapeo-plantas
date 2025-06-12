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

$sql = "UPDATE equipos SET nombre = ?, ip = ?, marca = ?, modelo = ?, funcion = ?, etiquetas = ?, foto = ? WHERE id = ?";
$stmt = $pdo->prepare($sql);
$success = $stmt->execute([$nombre, $ip, $marca, $modelo, $funcion, $etiquetas, $foto, $id]);

echo json_encode(["success" => $success]);

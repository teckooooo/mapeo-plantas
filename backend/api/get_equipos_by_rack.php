<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$rack_id = $_GET['rack_id'] ?? null;

if (!$rack_id) {
  echo json_encode(["success" => false, "error" => "Parámetro rack_id faltante"]);
  exit;
}

$sql = "SELECT id, nombre, ip FROM equipos WHERE rack_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$rack_id]);
$equipos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "data" => $equipos]);

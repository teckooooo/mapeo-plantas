<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$planta_id = $_GET['planta_id'] ?? null;

if (!$planta_id) {
  echo json_encode(["success" => false, "error" => "Parámetro planta_id faltante"]);
  exit;
}

$sql = "SELECT e.id, e.nombre, e.ip, r.numero AS rack_numero, r.id AS rack_id
        FROM equipos e
        JOIN racks r ON e.rack_id = r.id
        WHERE r.planta_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$planta_id]);
$equipos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "data" => $equipos]);

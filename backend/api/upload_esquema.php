<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['planta_id'], $data['base64'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$planta_id = $data['planta_id'];
$base64 = $data['base64'];

$stmt = $pdo->prepare("UPDATE plantas SET esquema_base64 = ? WHERE id = ?");
$success = $stmt->execute([$base64, $planta_id]);

echo json_encode(["success" => $success]);

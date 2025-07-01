<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['planta_id'])) {
    echo json_encode(["success" => false, "error" => "Falta planta_id"]);
    exit;
}

$planta_id = $data['planta_id'];

$stmt = $pdo->prepare("UPDATE plantas SET esquema_base64 = NULL WHERE id = ?");
$success = $stmt->execute([$planta_id]);

echo json_encode(["success" => $success]);

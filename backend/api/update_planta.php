<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$nombre = trim($data['nombre'] ?? '');

if (!$id || !$nombre) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE plantas SET nombre = ? WHERE id = ?");
$success = $stmt->execute([$nombre, $id]);

echo json_encode(["success" => $success]);

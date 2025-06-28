<?php
// Permitir solicitudes desde cualquier origen (o restringir a http://localhost:3000 si deseas)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$nombre = trim($data['nombre'] ?? '');

if (!$nombre) {
    echo json_encode(["success" => false, "message" => "Nombre vacío"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO plantas (nombre) VALUES (?)");
$success = $stmt->execute([$nombre]);

echo json_encode(["success" => $success]);

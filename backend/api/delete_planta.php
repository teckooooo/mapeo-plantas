<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID no proporcionado"]);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM plantas WHERE id = ?");
$success = $stmt->execute([$id]);

echo json_encode(["success" => $success]);

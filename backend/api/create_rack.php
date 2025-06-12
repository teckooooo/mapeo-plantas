<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

// Validar entrada
if (!$data || !isset($data['planta_id'], $data['numero'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$planta_id   = (int) $data['planta_id'];
$numero      = trim($data['numero']);
$descripcion = trim($data['descripcion'] ?? "");

try {
    // Validar existencia de planta
    $stmt = $pdo->prepare("SELECT id FROM plantas WHERE id = ?");
    $stmt->execute([$planta_id]);
    if ($stmt->rowCount() === 0) {
        echo json_encode(["success" => false, "error" => "Planta no existe"]);
        exit;
    }

    $sql = "INSERT INTO racks (planta_id, numero, descripcion) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([$planta_id, $numero, $descripcion]);

    echo json_encode(["success" => $success]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => "Error SQL: " . $e->getMessage()
    ]);
}

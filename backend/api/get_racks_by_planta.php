<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$planta_id = isset($_GET['planta_id']) ? intval($_GET['planta_id']) : null;

if (!$planta_id) {
    echo json_encode([
        "success" => false,
        "error" => "Parámetro planta_id requerido"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM racks WHERE planta_id = ?");
    $stmt->execute([$planta_id]);
    $racks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $racks
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Error en la consulta: " . $e->getMessage()
    ]);
}
exit;

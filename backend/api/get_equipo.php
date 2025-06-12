<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Validar parámetro id
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode([
        "success" => false,
        "error" => "Parámetro 'id' no válido"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM equipos WHERE id = ?");
    $stmt->execute([$id]);
    $equipo = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($equipo) {
        echo json_encode($equipo);
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Dispositivo no encontrado"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Error en la consulta: " . $e->getMessage()
    ]);
}

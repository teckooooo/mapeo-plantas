<?php
// Habilita CORS correctamente ANTES de cualquier salida
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Mostrar errores (solo para desarrollo)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Manejo para solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/db.php';

$stmt = $pdo->query("SELECT * FROM plantas");
$plantas = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($plantas);

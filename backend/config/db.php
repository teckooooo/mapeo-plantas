<?php
$host = 'localhost';
$db = 'mapeo_plantas';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos: " . $e->getMessage()
    ]);
    exit;
}

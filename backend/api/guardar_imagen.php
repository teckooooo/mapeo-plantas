<?php
require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

try {
    // Decodificar JSON de entrada
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['rack_id'], $data['nombre_archivo'], $data['data_larga'])) {
        throw new Exception("Datos incompletos");
    }

    $rack_id = $data['rack_id'];
    $nombre_archivo = basename($data['nombre_archivo']); // Limpieza básica
    $base64_raw = explode(',', $data['data_larga'])[1] ?? null;

    if (!$base64_raw) {
        throw new Exception("Base64 malformado");
    }

    $data_larga = base64_decode($base64_raw);
    if ($data_larga === false) {
        throw new Exception("No se pudo decodificar la imagen base64");
    }

    $sql = "INSERT INTO imagenes (rack_id, nombre_archivo, data_larga) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([$rack_id, $nombre_archivo, $data_larga])) {
        $errorInfo = $stmt->errorInfo();
        throw new Exception("Error SQL: " . $errorInfo[2]);
    }

    echo json_encode(["success" => true, "imagen_id" => $pdo->lastInsertId()]);
} catch (Exception $e) {
    // Asegura que siempre se responde con JSON válido
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

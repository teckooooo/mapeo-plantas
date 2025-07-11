<?php
// CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Max-Age: 86400");
    http_response_code(200);
    exit();
}

require_once '../config/db.php';

// Encabezados
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// Configuraciones PHP
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);
ini_set('memory_limit', '512M');
ini_set('post_max_size', '64M');
ini_set('upload_max_filesize', '64M');

try {
    $raw_input = file_get_contents("php://input");

    if (!$raw_input) {
        throw new Exception("No se recibió contenido (posible límite de tamaño)");
    }

    file_put_contents("debug_imagen.txt", "📥 RAW JSON (recortado):\n" . substr($raw_input, 0, 300) . "\n", FILE_APPEND);

    $data = json_decode($raw_input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON malformado: " . json_last_error_msg());
    }

    if (!isset($data['rack_id'], $data['nombre_archivo'], $data['data_larga'])) {
        throw new Exception("Datos incompletos");
    }

    $rack_id = $data['rack_id'];
    $nombre_archivo = basename($data['nombre_archivo']);
    $base64_parts = explode(',', $data['data_larga']);
    $base64_raw = $base64_parts[1] ?? null;

    if (!$base64_raw) {
        throw new Exception("Base64 malformado o vacío");
    }

    $data_larga = base64_decode($base64_raw);
    if ($data_larga === false) {
        throw new Exception("No se pudo decodificar la imagen base64");
    }

    // Validar tipo MIME
    $finfo = finfo_open();
    $mime_type = finfo_buffer($finfo, $data_larga, FILEINFO_MIME_TYPE);
    finfo_close($finfo);

    if (strpos($mime_type, 'image/') !== 0) {
        throw new Exception("Tipo MIME no válido: $mime_type");
    }

    // ⚠️ Eliminar imagecreatefromstring si no tienes GD instalado
    // Solo validar que el tipo sea imagen y esté bien decodificado
    // Si quieres validar con GD, asegúrate de que esté instalado

    // Guardar en base de datos
    $sql = "INSERT INTO imagenes (rack_id, nombre_archivo, data_larga) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([$rack_id, $nombre_archivo, $data_larga])) {
        $errorInfo = $stmt->errorInfo();
        throw new Exception("Error SQL: " . $errorInfo[2]);
    }

    file_put_contents("debug_imagen.txt", "✅ Imagen subida con éxito\n", FILE_APPEND);
    echo json_encode(["success" => true, "imagen_id" => $pdo->lastInsertId()]);

} catch (Exception $e) {
    http_response_code(500);
    file_put_contents("debug_imagen.txt", "❌ " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

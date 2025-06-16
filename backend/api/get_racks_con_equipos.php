<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

file_put_contents("debug_log.txt", "== Inicio del script ==\n", FILE_APPEND);

require_once '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$planta_id = $_GET['planta_id'] ?? null;

if (!$planta_id) {
    file_put_contents("debug_log.txt", "Falta planta_id\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => "Falta parámetro planta_id"]);
    exit;
}

try {
    file_put_contents("debug_log.txt", "Consulta de racks\n", FILE_APPEND);
    $stmt = $pdo->prepare("SELECT * FROM racks WHERE planta_id = ?");
    $stmt->execute([$planta_id]);
    $racks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($racks)) {
        file_put_contents("debug_log.txt", "Sin racks\n", FILE_APPEND);
        echo json_encode([]);
        exit;
    }

    foreach ($racks as &$rack) {
        file_put_contents("debug_log.txt", "Procesando rack ID {$rack['id']}\n", FILE_APPEND);

        // Imágenes
        $stmtImg = $pdo->prepare("SELECT id, nombre_archivo, data_larga FROM imagenes WHERE rack_id = ?");
        $stmtImg->execute([$rack['id']]);
        $imagenes = $stmtImg->fetchAll(PDO::FETCH_ASSOC);

        $rack['fotos'] = array_map(function ($img) {
            return [
                'id' => $img['id'],
                'src' => 'data:image/jpeg;base64,' . base64_encode($img['data_larga']),
                'nombre_archivo' => $img['nombre_archivo']
            ];
        }, $imagenes);

        // Equipos
        $stmtEq = $pdo->prepare("
            SELECT 
                id, imagen_id, nombre, ip, marca, modelo, funcion, etiquetas,
                area_x AS x, area_y AS y, area_width AS width, area_height AS height
            FROM equipos
            WHERE rack_id = ?
        ");
        $stmtEq->execute([$rack['id']]);
        $rack['equipos'] = $stmtEq->fetchAll(PDO::FETCH_ASSOC);
    }

    file_put_contents("debug_log.txt", "Todo ok. Enviando JSON.\n", FILE_APPEND);
    echo json_encode($racks, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;

} catch (Exception $e) {
    file_put_contents("debug_log.txt", "ERROR: {$e->getMessage()}\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit;
}

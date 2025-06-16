<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

require_once '../config/db.php';
header("Content-Type: application/json");

// Leer y registrar los datos recibidos para depurar
$input = file_get_contents("php://input");
file_put_contents("debug_log.txt", "🟡 RAW POST: " . $input . "\n", FILE_APPEND);

$data = json_decode($input, true);

// Validar ID
if (!$data || !isset($data['id']) || !is_numeric($data['id'])) {
  file_put_contents("debug_log.txt", "❌ ID no válido o datos corruptos\n", FILE_APPEND);
  echo json_encode(["success" => false, "error" => "ID no válido"]);
  exit;
}

// Asignar valores con seguridad
$id     = (int)$data['id'];
$x      = isset($data['x']) ? (float)$data['x'] : 0;
$y      = isset($data['y']) ? (float)$data['y'] : 0;
$width  = isset($data['width']) ? (float)$data['width'] : null;
$height = isset($data['height']) ? (float)$data['height'] : null;

// Usar los nombres correctos de columnas: area_x, area_y, area_width, area_height
if ($width !== null && $height !== null) {
  $sql = "UPDATE equipos SET area_x = ?, area_y = ?, area_width = ?, area_height = ? WHERE id = ?";
  $params = [$x, $y, $width, $height, $id];
} else {
  $sql = "UPDATE equipos SET area_x = ?, area_y = ? WHERE id = ?";
  $params = [$x, $y, $id];
}

$stmt = $pdo->prepare($sql);
$success = $stmt->execute($params);

// Log de resultado
file_put_contents("debug_log.txt", "✅ Resultado: " . ($success ? "Éxito" : "Fallo") . "\n", FILE_APPEND);
echo json_encode(["success" => $success]);

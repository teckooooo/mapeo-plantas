<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

require_once '../config/db.php';

$stmt = $pdo->query("SELECT * FROM plantas");
$plantas = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($plantas);

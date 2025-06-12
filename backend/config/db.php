<?php
$host = 'localhost';
$db = 'mapeo_plantas';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
} catch (PDOException $e) {
    echo 'Error: ' . $e->getMessage();
    exit;
}

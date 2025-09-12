<?php


$host = 'postgresdb.siempro.gob.ar';      // Ej: 'localhost' o IP por VPN
$port = '5432';            // Puerto estándar
$dbname = 'sigfrido';    // Nombre de tu base
$user = 'cpaez';       // Usuario con permisos
$password = 'r26BfMVZ';     // Contraseña


try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}

?>
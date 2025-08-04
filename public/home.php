<?php
session_start();
if (!isset($_SESSION['user'])) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Home</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <!-- home CSS -->
    <link href="assets/css/home.css" rel="stylesheet" />
</head>
<body>
  <?php include 'includes/navbar.php'; ?>

  <div id="sidebar">
    <!-- Aquí va el panel izquierdo -->
    <h5>Panel Izquierdo</h5>
    <!-- Más contenido... -->
  </div>

  <div id="map"></div>

  <?php include 'includes/footer.php'; ?>

  <!-- Bootstrap JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Mapa JS -->
<script src="assets/js/mapa.js"></script>

</body>
</html>

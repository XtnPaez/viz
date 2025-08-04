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

    <div class="accordion" id="accordionCapas">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingEfectores">
          <button class="accordion-button collapsed fw-bold text-white" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseEfectores" 
                  aria-expanded="false" 
                  aria-controls="collapseEfectores" 
                  style="background-color: #F7921E; font-family: 'Montserrat', sans-serif;">
            EFECTORES
          </button>
        </h2>
        <div id="collapseEfectores" class="accordion-collapse collapse" aria-labelledby="headingEfectores" data-bs-parent="#accordionCapas">
          <div class="accordion-body" id="grupo-efectores">
            <!-- Checkboxes de capas se cargarán aquí -->
          </div>
        </div>
      </div>
    </div>

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

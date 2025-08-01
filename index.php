<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Visualizador de Capas</title>    
        <!-- Bootstrap -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- Leaflet -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <!-- Fuente Montserrat -->
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
        <!-- Estilo de index -->
        <link href="css/index.css" rel="stylesheet">
    </head>
    <body>
        <?php include 'includes/navbar.php'; ?>
        <div id="app">
            <div id="sidebar">
    <h5>Capas disponibles</h5>
    <div class="mb-3">
        <label for="capaSelect" class="form-label">Capa</label>
        <select class="form-select" id="capaSelect">
            <option value="" selected disabled>Elegí una capa</option>
            <option value="provincias">Provincias</option>
        </select>
    </div>

    <button id="limpiarMapa" class="btn text-white mt-3" style="background-color: #F3AF63;">Limpiar mapa</button>


    
</div>

            <div id="map"></div>
        </div>
        <?php include 'includes/footer.php'; ?>
        <script src="js/mapa.js"></script>
    
    </body>
</html>

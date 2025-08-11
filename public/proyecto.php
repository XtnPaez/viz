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
    <title>EFPI : Home</title>    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- home CSS -->
    <link href="assets/css/home.css" rel="stylesheet" />
    <!-- proyecto CSS -->
    <link href="assets/css/proyecto.css" rel="stylesheet" />   
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
    <main class="container">
        <h1>Proyecto EFPI</h1>
        <p class="lead">
            Bienvenido a la sección de información sobre el proyecto EFPI. Aquí podrás encontrar
            detalles, análisis, tablas y explicaciones sobre el funcionamiento del sistema.
        </p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
            Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh
            elementum imperdiet. Duis sagittis ipsum. Praesent mauris.
        </p>
        <h2>Datos de referencia</h2>
        <p>
            A continuación se presenta un ejemplo de tabla con datos. Puedes reemplazarla
            por datos reales.
        </p>
        <div class="table-responsive">
            <table class="table table-striped table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>Indicador</th>
                        <th>Valor</th>
                        <th>Unidad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Población total</td>
                        <td>1,234,567</td>
                        <td>habitantes</td>
                    </tr>
                    <tr>
                        <td>Centros de salud</td>
                        <td>345</td>
                        <td>unidades</td>
                    </tr>
                    <tr>
                        <td>Superficie</td>
                        <td>45,678</td>
                        <td>km²</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h2>Conclusiones</h2>
        <p>
            Este espacio está pensado para agregar información más extensa, resultados de análisis,
            y todo lo que necesites documentar.
        </p>
    </main>
    <?php include 'includes/footer.php'; ?>
    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
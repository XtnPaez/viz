// Capa base Argenmap
    const argenmap = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
        minZoom: 1,
        maxZoom: 20,
        attribution: '© IGN Argentina - Argenmap'
    });

    // Capa base OSM
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    });

    // Mapa
    const map = L.map('map', {
        center: [-38.5, -63],
        zoom: 4.5,
        layers: [argenmap] // Argenmap como base predeterminada
    });

    // Control de capas base
    const baseMaps = {
        "Argenmap": argenmap,
        "OpenStreetMap": osm
    };

    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    let capaActiva = null;

document.getElementById('capaSelect').addEventListener('change', function () {
    const valor = this.value;

    if (valor === 'provincias') {
        fetch('provincias.php')
            .then(res => res.json())
            .then(geojson => {
                if (capaActiva) {
                    map.removeLayer(capaActiva);
                }

                capaActiva = L.geoJSON(geojson, {
                    style: {
                        color: '#0055AA',
                        weight: 1,
                        fillColor: '#88CCEE',
                        fillOpacity: 0.4
                    }
                }).addTo(map);

                mostrarLeyenda('provincias');
            });
    }

    // Resetea el select a "Elegí una capa" después de cargar
    this.selectedIndex = 0;
});


function mostrarLeyenda(tipo) {
    let leyenda = document.getElementById('leyenda');

    if (!leyenda) {
        leyenda = document.createElement('div');
        leyenda.id = 'leyenda';
        leyenda.className = 'leaflet-bottom leaflet-right bg-white p-2 shadow rounded';
        leyenda.style.zIndex = 1000;
        leyenda.innerHTML = '';
        document.body.appendChild(leyenda);
    }

    leyenda.innerHTML = '';

    if (tipo === 'provincias') {
        leyenda.innerHTML = `
            <strong>Leyenda:</strong>
            <div class="mt-1 d-flex align-items-center">
                <div style="width: 20px; height: 20px; background-color: #88CCEE; border: 1px solid #0055AA; margin-right: 5px;"></div>
                Provincias
            </div>
        `;
    } else {
        // si tenés otras capas en el futuro
        leyenda.innerHTML = '<strong>Leyenda:</strong> No definida';
    }

    leyenda.style.display = 'block';
}

function ocultarLeyenda() {
    const leyenda = document.getElementById('leyenda');
    if (leyenda) leyenda.style.display = 'none';
}

if (capaActiva) {
    map.removeLayer(capaActiva);
    ocultarLeyenda();
}


document.getElementById('limpiarMapa').addEventListener('click', () => {
    if (capaActiva) {
        map.removeLayer(capaActiva);
        capaActiva = null;
    }

    ocultarLeyenda();

    // Reinicia select
    document.getElementById('capaSelect').selectedIndex = 0;
});

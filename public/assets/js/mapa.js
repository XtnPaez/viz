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

// Crear mapa
const map = L.map('map', {
    center: [-38.5, -63],
    zoom: 4.5,
    layers: [argenmap] // Base por defecto
});

// Control de capas base
const baseMaps = {
    "Argenmap": argenmap,
    "OpenStreetMap": osm
};
L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

// Variables para capas
let capaProvincias = null;
let capaOficinas = null;

// Selector de capas
const capaSelect = document.getElementById('capaSelect');

// Leyenda
let leyenda = document.createElement('div');
leyenda.id = 'leyenda';
leyenda.className = 'leaflet-bottom leaflet-right bg-white p-2 shadow rounded';
leyenda.style.zIndex = 1000;
leyenda.style.display = 'none';
document.body.appendChild(leyenda);

// Funciones de leyenda
function mostrarLeyendaProvincias() {
    leyenda.innerHTML = `
        <strong>Leyenda:</strong>
        <div class="mt-1 d-flex align-items-center">
            <div style="width: 20px; height: 20px; background-color: #88CCEE; border: 1px solid #0055AA; margin-right: 5px;"></div>
            Provincias
        </div>`;
    leyenda.style.display = 'block';
}

function mostrarLeyendaOficinas() {
    leyenda.innerHTML = `
        <strong>Oficinas ANSES</strong><br>
        <span style="display:inline-block;width:12px;height:12px;background:#F7921E;border:1px solid #D97300;border-radius:50%;margin-right:5px;"></span> Oficina`;
    leyenda.style.display = 'block';
}

function ocultarLeyenda() {
    leyenda.style.display = 'none';
}

// Estilo oficinas
function estiloOficinas(feature) {
    return {
        radius: 6,
        fillColor: "#F7921E",
        color: "#D97300",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

// Limpia capas activas
function limpiarCapa() {
    if (capaProvincias) {
        map.removeLayer(capaProvincias);
        capaProvincias = null;
    }
    if (capaOficinas) {
        map.removeLayer(capaOficinas);
        capaOficinas = null;
    }
    ocultarLeyenda();
}

// Listener para el combo
capaSelect.addEventListener('change', function () {
    const valor = this.value;
    limpiarCapa();

    if (valor === 'provincias') {
        fetch('provincias.php')
            .then(res => res.json())
            .then(geojson => {
                capaProvincias = L.geoJSON(geojson, {
                    style: {
                        color: '#0055AA',
                        weight: 1,
                        fillColor: '#88CCEE',
                        fillOpacity: 0.4
                    }
                }).addTo(map);
                mostrarLeyendaProvincias();
            });
    } else if (valor === 'oficinas') {
        fetch('oficinas_anses.php')
            .then(res => res.json())
            .then(geojson => {
                capaOficinas = L.geoJSON(geojson, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, estiloOficinas(feature));
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(
                            `<strong>SGT: </strong>${feature.properties.sgt}<br>
                             <strong>Provincia: </strong>${feature.properties.provincia} <br>
                             <strong>Localidad: </strong>${feature.properties.localidad} <br>
                             <strong>Dirección: </strong>${feature.properties.direccion}`
                        );
                    }
                }).addTo(map);
                mostrarLeyendaOficinas();
            });
    }

    this.selectedIndex = 0;
});

// Botón limpiar mapa
document.getElementById('limpiarMapa').addEventListener('click', () => {
    limpiarCapa();
    capaSelect.selectedIndex = 0;
});

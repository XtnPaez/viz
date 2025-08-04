// Definición de capas base
var argenmap = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
    minZoom: 1,
    maxZoom: 20,
    attribution: '© IGN Argentina - Argenmap || SIEMPRO | Informática de Datos | Información Social'
});

var argenmap_gris = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
    minZoom: 1,
    maxZoom: 20,
    attribution: '© IGN Argentina - Argenmap Base Gris || SIEMPRO | Informática de Datos | Información Social'
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors || SIEMPRO | Informática de Datos | Información Social'
});

// Inicialización del mapa con capa base predeterminada
var map = L.map('map', {
    center: [-38.5, -63],
    zoom: 4,
    layers: [argenmap]
});

// Control de capas base colapsado arriba a la derecha
var baseLayers = {
    "Argenmap": argenmap,
    "Argenmap Gris": argenmap_gris,
    "OpenStreetMap": osm
};

const overlayLayers = {}; // Para guardar capas agrupadas

// Función principal: carga catálogo y arma panel
function cargarCapasDesdeCatalogo() {
    fetch('/viz/api/catalogo_capas.json')
        .then(response => response.json())
        .then(data => {
            data.capas.forEach(capa => {
                fetch(capa.url)
                    .then(response => response.json())
                    .then(geojson => {
                        let nuevaCapa;

                        if (capa.tipo === "puntos") {
                            nuevaCapa = L.geoJSON(geojson, {
                                pointToLayer: function (feature, latlng) {
                                    return L.circleMarker(latlng, {
                                        radius: 6,
                                        fillColor: capa.color || "#3388ff",
                                        color: "#000",
                                        weight: 1,
                                        opacity: 1,
                                        fillOpacity: 0.8
                                    });
                                },
                                onEachFeature: function (feature, layer) {
                                    let props = feature.properties;
                                    let popupContent = "";
                                    for (let key in props) {
                                        popupContent += `<strong>${key}:</strong> ${props[key]}<br>`;
                                    }
                                    layer.bindPopup(popupContent);
                                }
                            });

                            // Guardar en overlayLayers pero NO agregar al mapa
                            if (!overlayLayers[capa.grupo]) {
                                overlayLayers[capa.grupo] = {};
                            }
                            overlayLayers[capa.grupo][capa.nombre] = nuevaCapa;

                            // Agregar checkbox al panel correspondiente
                            agregarCheckboxAlPanel(capa.grupo, capa.nombre);
                        }
                    });
            });
        })
        .catch(error => {
            console.error("Error al cargar catálogo de capas:", error);
        });
}

// Agrega checkbox al panel (ya definido en HTML)
function agregarCheckboxAlPanel(grupo, nombre) {
    // Transformar grupo a minúsculas para coincidir con ID en HTML
    const panel = document.getElementById(`grupo-${grupo.toLowerCase()}`);
    if (!panel) {
        console.warn(`No se encontró el panel para grupo: ${grupo}`);
        return;
    }

    const capa = overlayLayers[grupo][nombre];

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input';
    checkbox.id = `chk-${grupo.toLowerCase()}-${nombre.replace(/\s+/g, '_')}`;

    const label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = checkbox.id;
    label.innerText = nombre;

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            capa.addTo(map);
        } else {
            map.removeLayer(capa);
        }
    });

    const formCheck = document.createElement('div');
    formCheck.className = 'form-check ms-3 mt-1';
    formCheck.appendChild(checkbox);
    formCheck.appendChild(label);

    panel.appendChild(formCheck);
}

// Ejecutar carga catálogo al inicio
cargarCapasDesdeCatalogo();

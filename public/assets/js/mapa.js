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

L.control.layers(baseLayers, null, {
    position: 'topright',
    collapsed: true
}).addTo(map);

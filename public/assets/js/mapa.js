// Capas base
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

// Inicialización del mapa
var map = L.map('map', {
    center: [-38.5, -63],
    zoom: 4,
    layers: [argenmap]
});

// Crear panes para controlar orden visual
map.createPane('poligonos');
map.getPane('poligonos').style.zIndex = 400;
map.createPane('puntos');
map.getPane('puntos').style.zIndex = 600;

// Control de capas base
var baseLayers = {
    "Argenmap": argenmap,
    "Argenmap Gris": argenmap_gris,
    "OpenStreetMap": osm
};

// Agregar control capas base (colapsado y en topright)
var controlCapasBase = L.control.layers(baseLayers, null, {
    collapsed: true,
    position: 'topright'
}).addTo(map);

// Objeto para guardar capas overlay
const overlayLayers = {};

// Para guardar datos del catálogo (para leyendas)
let catalogoCapasGlobal = [];

// Para leyendas activas (clave grupo-nombre)
const leyendasActivas = {};

// Función para actualizar panel leyendas abajo a la derecha
function actualizarPanelLeyendas() {
    if (map._controlLeyendas) {
        map.removeControl(map._controlLeyendas);
    }
    const keys = Object.keys(leyendasActivas);
    if (keys.length === 0) return;
    const LeyendasControl = L.Control.extend({
        options: { position: 'bottomright' },
        onAdd: function () {
            const container = L.DomUtil.create('div', 'map-leyendas-control');
            container.style.background = 'white';
            container.style.padding = '8px';
            container.style.maxHeight = '150px';
            container.style.overflowY = 'auto';
            container.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
            container.style.fontSize = '12px';
            container.style.borderRadius = '4px';
            keys.forEach(key => {
                const leyenda = leyendasActivas[key];
                const div = document.createElement('div');
                div.style.marginBottom = '6px';
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.innerHTML = `
    <div style="width:18px; height:18px; margin-right:8px; display:flex; align-items:center; justify-content:center;">
        ${
            leyenda.tipo === 'puntos'
            ? `<div style="width:12px; height:12px; background:${leyenda.color}; border:1px solid #000; border-radius:50%;"></div>`
            : `<div style="width:16px; height:3px; background:${leyenda.color};"></div>`
        }
    </div>
    <div>${leyenda.nombre}</div>
                `;
                container.appendChild(div);
            });
            return container;
        }
    });
    map._controlLeyendas = new LeyendasControl();
    map.addControl(map._controlLeyendas);
}

// Buscar metadata de capa en el catálogo global
function buscarCapaMeta(grupo, nombre) {
    return catalogoCapasGlobal.find(capa => capa.grupo === grupo && capa.nombre === nombre);
}

// Agregar checkbox a panel lateral y manejar capas + leyendas
function agregarCheckboxAlPanel(grupo, nombre) {
    const idPanel = `grupo-${grupo.toLowerCase().replace(/\s+/g, '_')}`;
    const panel = document.getElementById(idPanel);
    if (!panel) {
        console.warn(`No se encontró el panel para grupo: ${grupo}`);
        return;
    }
    const capa = overlayLayers[grupo][nombre];
    const meta = buscarCapaMeta(grupo, nombre);
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

            // Agregar leyenda dinámica
            if (meta) {
                leyendasActivas[`${grupo}-${nombre}`] = {
                    nombre: nombre,
                    tipo: meta.tipo,
                    color: meta.color || (meta.tipo === 'poligono' ? '#003366' : '#3388ff')
                };
            }
            actualizarPanelLeyendas();
        } else {
            map.removeLayer(capa);
            delete leyendasActivas[`${grupo}-${nombre}`];
            actualizarPanelLeyendas();
        }
    });
    const formCheck = document.createElement('div');
    formCheck.className = 'form-check ms-3 mt-1';
    formCheck.appendChild(checkbox);
    formCheck.appendChild(label);
    panel.appendChild(formCheck);
}

// Cargar capas desde catálogo y crear objetos Leaflet
function cargarCapasDesdeCatalogo() {
    fetch('/viz/api/catalogo_capas.json')
        .then(response => response.json())
        .then(data => {
            catalogoCapasGlobal = data.capas;
            data.capas.forEach(capa => {
                fetch(capa.url)
                    .then(response => response.json())
                    .then(geojson => {
                        let nuevaCapa;
                        let opcionesGenerales = {
                            pane: capa.tipo === "puntos" ? 'puntos' : 'poligonos'
                        };
                        if (capa.tipo === "puntos") {
                            nuevaCapa = L.geoJSON(geojson, {
                                ...opcionesGenerales,
                                pointToLayer: function (feature, latlng) {
                                    return L.circleMarker(latlng, {
                                        pane: 'puntos',
                                        radius: 4,
                                        fillColor: capa.color || "#3388ff",
                                        color: "#000",
                                        weight: 1,
                                        opacity: 1,
                                        fillOpacity: 0.85
                                    });
                                },
                                onEachFeature: function (feature, layer) {
                                    let props = feature.properties;
                                    let popupContent = "";
                                    if (capa.popup_campos && Array.isArray(capa.popup_campos)) {
                                        capa.popup_campos.forEach(campo => {
                                            if (props[campo]) {
                                                popupContent += `<strong>${campo.toUpperCase()}:</strong> ${props[campo]}<br>`;
                                            }
                                        });
                                    } else {
                                        for (let key in props) {
                                            popupContent += `<strong>${key.toUpperCase()}:</strong> ${props[key]}<br>`;
                                        }
                                    }
                                    layer.bindPopup(popupContent);
                                }
                            });
                        }
                        if (capa.tipo === "poligono") {
                            nuevaCapa = L.geoJSON(geojson, {
                                ...opcionesGenerales,
                                style: {
                                    color: "#003366",
                                    weight: 1.5,
                                    fillOpacity: 0
                                },
                                onEachFeature: function (feature, layer) {
                                    let props = feature.properties;
                                    let popupContent = "";
                                    if (props["NOMBRE"]) {
                                        popupContent = `<strong>NOMBRE:</strong> ${props["NOMBRE"]}`;
                                    }
                                    layer.bindPopup(popupContent);
                                    layer.on({
                                        mouseover: function (e) {
                                            e.target.setStyle({
                                                weight: 2,
                                                color: "#000066",
                                                fillOpacity: 0
                                            });
                                        },
                                        mouseout: function (e) {
                                            nuevaCapa.resetStyle(e.target);
                                        }
                                    });
                                }
                            });
                        }
                        if (!overlayLayers[capa.grupo]) {
                            overlayLayers[capa.grupo] = {};
                        }
                        overlayLayers[capa.grupo][capa.nombre] = nuevaCapa;
                        agregarCheckboxAlPanel(capa.grupo, capa.nombre);
                    });
            });
        })
        .catch(error => {
            console.error("Error al cargar catálogo de capas:", error);
        });
}

// Ejecutar carga inicial de capas
cargarCapasDesdeCatalogo();

// Guardamos la vista inicial para poder volver
const vistaInicial = {
  center: [-38.5, -63],
  zoom: 4
};

// Crear control personalizado para botón "Resetear vista"
const botonResetVista = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.style.backgroundColor = 'white';
    container.style.width = '30px';
    container.style.height = '30px';
    container.style.cursor = 'pointer';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.title = 'Volver a vista inicial';
    container.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/></svg>';
    container.onclick = function () {
      map.setView(vistaInicial.center, vistaInicial.zoom);
    };

    // Evitar propagación para que no cierre otros controles al hacer clic
    L.DomEvent.disableClickPropagation(container);
    return container;
  }
});

// Agregar el botón al mapa
map.addControl(new botonResetVista());
// Corridor Map Loader
// Initializes the map and prepares layers for contamination + parcel overlays

let map;

function initMap() {
    const el = document.getElementById("map-container");
    if (!el) return;

    el.innerHTML = ""; // Clear placeholder

    // Basic Leaflet map
    map = L.map("map-container").setView([39.94, -75.12], 12); // Camden default

    // Base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(map);

    // Placeholder for contamination layer
    const contaminationLayer = L.layerGroup().addTo(map);

    // Placeholder for parcels
    const parcelLayer = L.layerGroup().addTo(map);

    // Expose layers for future modules
    return {
        map,
        contaminationLayer,
        parcelLayer
    };
}

export { initMap };

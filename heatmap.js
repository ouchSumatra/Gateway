// Corridor Heatmap Module
// Visualizes contamination intensity using a heatmap layer

let heatLayer = null;

function loadHeatmap(map) {
    // Remove old layer if it exists
    if (heatLayer) {
        map.removeLayer(heatLayer);
    }

    // Placeholder contamination intensity points
    const points = [
        [39.948, -75.123, 0.9],
        [39.950, -75.121, 0.7],
        [39.952, -75.125, 0.8],
        [39.946, -75.128, 0.6],
        [39.944, -75.130, 0.5]
    ];

    // Convert to Leaflet heatmap format
    const heatData = points.map(p => [p[0], p[1], p[2]]);

    // Create heatmap
    heatLayer = L.heatLayer(heatData, {
        radius: 35,
        blur: 20,
        maxZoom: 17,
        max: 1.0
    });

    heatLayer.addTo(map);
}

export { loadHeatmap };

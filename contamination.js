// Contamination Overlay Loader
// Pulls contamination corridor data and renders it onto the map

let contaminationLayerRef = null;

async function loadContamination(map, contaminationLayer) {
    contaminationLayerRef = contaminationLayer;

    // Placeholder data until backend endpoint is connected
    const sampleCorridors = [
        {
            name: "VOC Corridor A",
            coords: [
                [39.945, -75.125],
                [39.950, -75.120],
                [39.955, -75.118]
            ],
            color: "#ff4444"
        },
        {
            name: "Heavy Metals Zone",
            coords: [
                [39.940, -75.130],
                [39.942, -75.128],
                [39.944, -75.126]
            ],
            color: "#ffaa00"
        }
    ];

    contaminationLayer.clearLayers();

    sampleCorridors.forEach(zone => {
        L.polyline(zone.coords, {
            color: zone.color,
            weight: 4,
            opacity: 0.8
        }).addTo(contaminationLayer);
    });
}

export { loadContamination };

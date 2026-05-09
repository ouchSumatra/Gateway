// Parcel Overlay Loader
// Renders parcel boundaries or points onto the map

let parcelLayerRef = null;

async function loadParcels(map, parcelLayer) {
    parcelLayerRef = parcelLayer;

    // Placeholder parcel data until backend endpoint is connected
    const sampleParcels = [
        {
            id: "P-001",
            coords: [39.948, -75.123],
            status: "delinquent",
            color: "#00ccff"
        },
        {
            id: "P-002",
            coords: [39.952, -75.127],
            status: "lien",
            color: "#ff00ff"
        }
    ];

    parcelLayer.clearLayers();

    sampleParcels.forEach(parcel => {
        L.circleMarker(parcel.coords, {
            radius: 8,
            color: parcel.color,
            fillColor: parcel.color,
            fillOpacity: 0.8
        })
        .bindPopup(`
            <strong>Parcel:</strong> ${parcel.id}<br>
            <strong>Status:</strong> ${parcel.status}
        `)
        .addTo(parcelLayer);
    });
}

export { loadParcels };

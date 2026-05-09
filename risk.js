// Corridor Risk Scoring Engine
// Computes a parcel's risk multiplier based on corridor proximity

function computeRisk(parcel, contaminationZones = []) {
    // Base risk
    let risk = 1.0;

    // If parcel is flagged contaminated
    if (parcel.contaminated) risk *= 1.5;

    // If parcel is inside a corridor
    if (parcel.inCorridor) risk *= 2.0;

    // Distance-based risk (placeholder)
    contaminationZones.forEach(zone => {
        zone.coords.forEach(coord => {
            const d = distance(parcel.coords, coord);
            if (d < 0.002) risk *= 1.2;   // very close
            else if (d < 0.005) risk *= 1.1; // moderately close
        });
    });

    return Number(risk.toFixed(2));
}

// Simple lat/lng distance (approx)
function distance(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx*dx + dy*dy);
}

// Render risk into UI
function renderRisk(parcel, zones = [], containerId = "risk-block") {
    const el = document.getElementById(containerId);
    if (!el) return;

    const score = computeRisk(parcel, zones);

    el.innerHTML = `
        <div><strong>Parcel:</strong> ${parcel.id}</div>
        <div><strong>Risk Multiplier:</strong> ${score}</div>
    `;
}

export { computeRisk, renderRisk };

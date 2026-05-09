// NVC Engine (Negative Value Certificate Calculator)
// Computes a placeholder NVC score until real backend data is connected

function calculateNVC(parcel) {
    // Placeholder logic — replace with real contamination + lien + tax data
    const base = 1000;

    const factors = {
        delinquent: 1.2,
        lien: 1.5,
        contaminated: 2.0,
        corridor: 2.5
    };

    let score = base;

    if (parcel.status === "delinquent") score *= factors.delinquent;
    if (parcel.status === "lien") score *= factors.lien;
    if (parcel.contaminated) score *= factors.contaminated;
    if (parcel.inCorridor) score *= factors.corridor;

    return Math.round(score);
}

// Render NVC into UI
function renderNVC(parcel, containerId = "nvc-block") {
    const el = document.getElementById(containerId);
    if (!el) return;

    const score = calculateNVC(parcel);

    el.innerHTML = `
        <div><strong>Parcel:</strong> ${parcel.id}</div>
        <div><strong>Status:</strong> ${parcel.status}</div>
        <div><strong>NVC Score:</strong> ${score}</div>
    `;
}

export { calculateNVC, renderNVC };

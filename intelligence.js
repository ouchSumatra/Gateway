// Parcel Intelligence Panel
// Displays a compact intelligence card for any parcel

import { calculateNVC } from "./nvc.js";
import { generateEvidence } from "./evidence.js";
import { getLedger } from "./supabase.js";

async function loadParcelIntel(parcelId) {
    const el = document.getElementById("intel-block");
    if (!el) return;

    el.innerHTML = "Loading parcel intelligence...";

    // Fetch ledger entries for this parcel
    const ledger = await getLedger(100);
    const parcelEntries = ledger.filter(e => e.parcel_id === parcelId);

    // Placeholder parcel metadata
    const parcelMeta = {
        id: parcelId,
        status: parcelEntries[0]?.type || "unknown",
        contaminated: true,
        inCorridor: true
    };

    // Compute NVC
    const nvcScore = calculateNVC(parcelMeta);

    // Render intelligence card
    el.innerHTML = `
        <div><strong>Parcel:</strong> ${parcelMeta.id}</div>
        <div><strong>Status:</strong> ${parcelMeta.status}</div>
        <div><strong>Contaminated:</strong> ${parcelMeta.contaminated}</div>
        <div><strong>In Corridor:</strong> ${parcelMeta.inCorridor}</div>
        <div><strong>NVC Score:</strong> ${nvcScore}</div>
        <div><strong>Ledger Entries:</strong> ${parcelEntries.length}</div>
        <button id="evidence-btn">Generate Evidence Packet</button>
    `;

    // Attach evidence generator
    document.getElementById("evidence-btn").onclick = () => {
        generateEvidence(parcelId);
        window.scrollTo(0, document.body.scrollHeight);
    };
}

export { loadParcelIntel };

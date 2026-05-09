// Evidence Packet Generator
// Builds a structured evidence packet for any parcel

import { calculateNVC } from "./nvc.js";
import { getLedger } from "./supabase.js";

async function generateEvidence(parcelId) {
    const el = document.getElementById("evidence-block");
    if (!el) return;

    el.innerHTML = "Generating evidence packet...";

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

    // Build packet
    const packet = {
        parcel: parcelMeta,
        ledger: parcelEntries,
        nvc: nvcScore,
        generated_at: new Date().toISOString()
    };

    // Render to UI
    el.innerHTML = `
        <pre>${JSON.stringify(packet, null, 2)}</pre>
    `;

    return packet;
}

export { generateEvidence };

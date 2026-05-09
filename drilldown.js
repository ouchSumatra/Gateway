// Parcel Drill‑Down Panel
// Shows full ledger history + contamination + risk + NVC breakdown

import { getLedger } from "./supabase.js";
import { calculateNVC } from "./nvc.js";
import { computeRisk } from "./risk.js";

async function loadDrilldown(parcelId, parcelMeta = {}) {
    const el = document.getElementById("drilldown-block");
    if (!el) return;

    el.innerHTML = "Loading parcel drill‑down...";

    // Fetch ledger entries
    const ledger = await getLedger(200);
    const entries = ledger.filter(e => e.parcel_id === parcelId);

    // Compute NVC + Risk
    const nvc = calculateNVC(parcelMeta);
    const risk = computeRisk(parcelMeta);

    // Render
    el.innerHTML = `
        <div><strong>Parcel:</strong> ${parcelId}</div>
        <div><strong>Status:</strong> ${parcelMeta.status || "unknown"}</div>
        <div><strong>NVC Score:</strong> ${nvc}</div>
        <div><strong>Risk Multiplier:</strong> ${risk}</div>
        <div><strong>Contaminated:</strong> ${parcelMeta.contaminated}</div>
        <div><strong>In Corridor:</strong> ${parcelMeta.inCorridor}</div>

        <h3>Ledger History</h3>
        <pre>${JSON.stringify(entries, null, 2)}</pre>

        <h3>Raw Parcel Metadata</h3>
        <pre>${JSON.stringify(parcelMeta, null, 2)}</pre>
    `;
}

export { loadDrilldown };

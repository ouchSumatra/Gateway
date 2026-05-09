// Dashboard Module
// Aggregates system metrics and renders a summary panel

import { getLedger } from "./supabase.js";

async function loadDashboard() {
    const el = document.getElementById("dashboard-block");
    if (!el) return;

    el.innerHTML = "Loading dashboard...";

    try {
        // Fetch latest ledger entries
        const ledger = await getLedger(50);

        const totalEntries = ledger?.length || 0;
        const latest = ledger?.[0] || null;

        const parcels = new Set(ledger?.map(e => e.parcel_id));
        const parcelCount = parcels.size;

        el.innerHTML = `
            <div><strong>System Status:</strong> Online</div>
            <div><strong>Total Ledger Entries:</strong> ${totalEntries}</div>
            <div><strong>Unique Parcels:</strong> ${parcelCount}</div>
            <div><strong>Last Update:</strong> ${latest ? latest.created_at : "N/A"}</div>
            <div><strong>Last Parcel:</strong> ${latest ? latest.parcel_id : "N/A"}</div>
        `;
    } catch (err) {
        el.innerHTML = "Dashboard unavailable.";
    }
}

export { loadDashboard };

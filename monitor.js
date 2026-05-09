// Automation Monitor Module
// Displays automation heartbeat + last ledger sync

import { getLedger } from "./supabase.js";

async function loadMonitor() {
    const el = document.getElementById("monitor-block");
    if (!el) return;

    el.innerHTML = "Checking automation...";

    try {
        const latest = await getLedger(1);

        if (!latest || latest.length === 0) {
            el.innerHTML = "No ledger entries yet. Automation may still be warming up.";
            return;
        }

        const entry = latest[0];

        el.innerHTML = `
            <div><strong>Automation:</strong> Online</div>
            <div><strong>Last Sync:</strong> ${entry.created_at}</div>
            <div><strong>Last Parcel:</strong> ${entry.parcel_id}</div>
            <div><strong>Last Type:</strong> ${entry.type}</div>
        `;
    } catch (err) {
        el.innerHTML = "Automation unreachable.";
    }
}

export { loadMonitor };

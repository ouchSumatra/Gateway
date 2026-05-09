// Ledger Viewer Module
// Pulls latest ledger entries and renders them into the UI

import { getLedger } from "./supabase.js";

async function loadLedger(limit = 20) {
    const container = document.getElementById("ledger-container");
    if (!container) return;

    container.innerHTML = "Loading ledger...";

    const entries = await getLedger(limit);

    if (!entries || entries.length === 0) {
        container.innerHTML = "No ledger entries found.";
        return;
    }

    container.innerHTML = entries
        .map(entry => `
            <div class="ledger-entry">
                <div><strong>Parcel:</strong> ${entry.parcel_id}</div>
                <div><strong>Type:</strong> ${entry.type}</div>
                <div><strong>Amount:</strong> $${entry.amount}</div>
                <div><strong>Date:</strong> ${entry.created_at}</div>
            </div>
        `)
        .join("");
}

// Auto-run when called from app.js
export { loadLedger };

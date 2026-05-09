// Gateway App Core
// Lightweight scaffold for future modules

console.log("Gateway App Loaded");

// Status block updater
function updateStatus(message) {
    const el = document.getElementById("status-block");
    if (el) el.innerText = message;
}

// Ping endpoint (placeholder for ledger, Supabase, or automation)
async function ping() {
    updateStatus("Checking system...");
    try {
        // Placeholder for real endpoint
        await new Promise(res => setTimeout(res, 500));
        updateStatus("System online.");
    } catch (err) {
        updateStatus("System error.");
    }
}

// Auto-run on load
window.addEventListener("load", () => {
    updateStatus("Initializing...");
    ping();
});

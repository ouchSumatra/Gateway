// Supabase Connector
// Core client for Gateway → Ledger communication

const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";

// Generic fetch wrapper
async function sbFetch(table, params = {}) {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);

    // Add filters
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, `eq.${value}`);
    });

    // Always select all fields
    url.searchParams.append("select", "*");

    const res = await fetch(url.toString(), {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
        }
    });

    if (!res.ok) {
        console.error("Supabase error:", await res.text());
        return null;
    }

    return await res.json();
}

// Fetch latest ledger entries
async function getLedger(limit = 20) {
    return sbFetch("ledger", { limit });
}

export { sbFetch, getLedger };

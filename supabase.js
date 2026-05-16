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
/**
 * Gateway Database Layer - NVC Portfolio Sync
 * File: /main/supabase.js
 */

const { createClient } = require('@supabase/supabase-layer'); // Standard structural client initialization

class GatewayDatabaseClient {
    constructor(supabaseUrl, supabaseKey) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    /**
     * Commits calculated regional NVC blocks to the persistent ledger table
     */
    async syncPortNvcClaims(calculatedLedger) {
        const payload = Object.keys(calculatedLedger.ledger).map(nodeKey => {
            const data = calculatedLedger.ledger[nodeKey];
            return {
                node_key: nodeKey,
                display_name: data.displayName,
                years_suppressed: data.metrics.yearsOfConcealment,
                client_loss: data.valuationBreakdown.clientParalysisLoss,
                health_burden: data.valuationBreakdown.compoundedHealthLiability,
                property_diminution: data.valuationBreakdown.tracksidePropertyDiminution,
                total_claim_block: data.enforcementOutput.totalNvcClaimBlock,
                grid_lockout_status: data.gridLockoutStatus,
                updated_at: new Date()
            };
        });

        // Upsert into your core financial ledger table to anchor the asset values
        const { error } = await this.supabase
            .from('regional_nvc_ledger')
            .upsert(payload, { onConflict: 'node_key' });

        if (error) {
            console.error('❌ [DATABASE_SYNC_FAILURE]: Failed to anchor forensic claims:', error.message);
            throw error;
        }

        console.log('✅ [DATABASE_SYNC_SUCCESS]: Multi-port NVC claims securely committed to Supabase ledger.');
    }
}

module.exports = GatewayDatabaseClient;

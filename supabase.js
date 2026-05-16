// Add this import at the very top of your file to enable local file writing
// Note: If running in a pure frontend environment, this can be swapped for localStorage
import fs from 'fs'; 

// Modify your savePortClaims function to include the defensive fallback catch:
async function savePortClaims(calculatedLedger) {
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
            timestamp: new Date().toISOString()
        };
    });

    try {
        const url = `${SUPABASE_URL}/rest/v1/regional_nvc_ledger`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "resolution=merge"
            },
            body: JSON.stringify(payload)
        });

        // If the database is full, rate-limited, or down, it returns a non-OK status
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Database rejected payload: ${errorText}`);
        }
        
        console.log("✅ [DATABASE_SYNC_SUCCESS]: Multi-port NVC claims securely committed to Supabase ledger.");
        return true;

    } catch (error) {
        console.error("⚠️ [DATABASE_CRITICAL_OVERFLOW]: Direct injection failed. Activating Local Plaintext Buffer.");
        
        // EXECUTE FALLBACK: Write the un-sanitized raw payload to a local file to preserve evidence
        const fallbackFileName = "nvc_ledger_fallback.json";
        
        let existingFallbackData = [];
        if (fs.existsSync(fallbackFileName)) {
            try {
                existingFallbackData = JSON.parse(fs.readFileSync(fallbackFileName, 'utf-8'));
            } catch (parseError) {
                existingFallbackData = [];
            }
        }

        // Append the new harvest blocks to the local file array
        existingFallbackData.push({
            harvestTimestamp: new Date().toISOString(),
            errorReason: error.message,
            data: payload
        });

        // Save back to disk in plain text
        fs.writeFileSync(fallbackFileName, JSON.stringify(existingFallbackData, null, 4), 'utf-8');
        
        console.log(`🔒 [LOCAL_BUFFER_SECURED]: Evidence dumped safely to plain text file: ./${fallbackFileName}`);
        
        // Return true to allow the agent to continue its cycle without losing its place
        return false; 
    }
}

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
// Append: On-Demand NVC Claim Ingestion
async function savePortClaims(calculatedLedger) {
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
            timestamp: new Date().toISOString()
        };
    });

    // Execute direct REST injection to anchor the multi-node asset values
    const url = `${SUPABASE_URL}/rest/v1/regional_nvc_ledger`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge" // Ensures upsert behavior without duplicating entries
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        console.error("❌ [DATABASE_SYNC_FAILURE]: Failed to anchor forensic claims:", await res.text());
        return null;
    }
    
    console.log("✅ [DATABASE_SYNC_SUCCESS]: Multi-port NVC claims securely committed to Supabase ledger.");
    return true;
}

// Update export to include the new enforcement ingestion layer
export { sbFetch, getLedger, savePortClaims };

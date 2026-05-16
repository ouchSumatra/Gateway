import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Initialize core Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Standard fetch utility wrapper for simple REST queries
 */
async function sbFetch(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const defaultHeaders = {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
    };

    const response = await fetch(url, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers }
    });

    if (!response.ok) {
        throw new Error(`Supabase fetch failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Reads logs from the primary ledger table
 */
async function getLedger() {
    return sbFetch('regional_nvc_ledger?select=*', { method: 'GET' });
}

/**
 * Object-Oriented Client Layer for structural asset management
 */
class GatewayDatabaseClient {
    constructor() {
        this.client = supabase;
    }

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

        const { error } = await this.client
            .from('regional_nvc_ledger')
            .upsert(payload, { onConflict: 'node_key' });

        if (error) {
            console.error('❌ [DATABASE_SYNC_FAILURE]: Failed to anchor forensic claims:', error.message);
            throw error;
        }

        console.log('✅ [DATABASE_SYNC_SUCCESS]: Multi-port NVC claims securely committed via Client Layer.');
    }
}

/**
 * On-Demand NVC Claim Ingestion with Local Plaintext Buffer Fallback
 */
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
                "Prefer": "resolution=merge" // Ensures upsert behavior without duplicating entries
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Database rejected payload: ${errorText}`);
        }
        
        console.log("✅ [DATABASE_SYNC_SUCCESS]: Multi-port NVC claims securely committed to Supabase ledger.");
        return true;

    } catch (error) {
        console.error("⚠️ [DATABASE_CRITICAL_OVERFLOW]: Direct injection failed. Activating Local Plaintext Buffer.");
        
        const fallbackFileName = "nvc_ledger_fallback.json";
        let existingFallbackData = [];
        
        if (fs.existsSync(fallbackFileName)) {
            try {
                existingFallbackData = JSON.parse(fs.readFileSync(fallbackFileName, 'utf-8'));
            } catch (parseError) {
                existingFallbackData = [];
            }
        }

        existingFallbackData.push({
            harvestTimestamp: new Date().toISOString(),
            errorReason: error.message,
            data: payload
        });

        fs.writeFileSync(fallbackFileName, JSON.stringify(existingFallbackData, null, 4), 'utf-8');
        console.log(`🔒 [LOCAL_BUFFER_SECURED]: Evidence dumped safely to plain text file: ./${fallbackFileName}`);
        return false; 
    }
}

// Unified export interface for the orchestration agent
export { sbFetch, getLedger, GatewayDatabaseClient, savePortClaims };

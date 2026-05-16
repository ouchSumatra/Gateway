/**
 * Gateway Forensic Platform - Realtime Remote Orchestrator & Dialogue Capture
 * File: /main/realtimeAgent.js
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Core Realtime Coordination & Ingestion Layer
 */
class RealtimeOrchestrator {
    constructor(nodeKey) {
        this.nodeKey = nodeKey;
        // Establish a unique realtime broadcast channel for the current presentation session
        this.syncChannel = supabase.channel(`presentation_session_${nodeKey}`);
    }

    /**
     * TRANSMITTER METHOD: Call this from your remote console to change the screen state
     */
    async broadcastStageChange(stage, targetAsset = null) {
        console.log(`🎛️ [REMOTE_CONSOLE]: Broadcasting state shift -> ${stage}`);
        
        await this.syncChannel.send({
            type: 'broadcast',
            event: 'stage_shift',
            payload: {
                currentStage: stage,
                target: targetAsset,
                timestamp: new Date().toISOString()
            }
        });
    }

    /**
     * RECEIVER METHOD: Run this on the presentation screen display to automatically sync views
     */
    listenAndSyncPresentation(onStageShiftCallback) {
        console.log(`📡 [DISPLAY_AGENT]: Listening for remote sync commands for session: ${this.nodeKey}...`);

        this.syncChannel
            .on('broadcast', { event: 'stage_shift' }, (response) => {
                const { currentStage, target } = response.payload;
                onStageShiftCallback(currentStage, target);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log("✅ [REALTIME_CONNECTED]: Presentation screen securely locked to the remote loop.");
                }
            });
    }

    /**
     * CAPTURE ENGINE: Pushes live verbal justifications or interaction text straight to the ledger
     */
    async recordCarrierResponse(cardId, responseType, notes = "") {
        console.log(`📥 [CAPTURE_LOOP]: Tracking live carrier response for Card: ${cardId}`);

        const responsePayload = {
            session_node: this.nodeKey,
            target_card_id: cardId,
            interaction_type: responseType,
            carrier_statement: notes,
            captured_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('carrier_negotiation_telemetry')
            .insert([responsePayload]);

        if (error) {
            console.error("❌ [TELEMETRY_FAILURE]: Failed to anchor live response:", error.message);
            return false;
        }

        console.log("🔒 [TELEMETRY_LOCKED]: Live carrier reaction securely added to the forensic record.");
        return true;
    }
}

/**
 * Conversational Prompt Matrix Generator
 */
class DialogueOrchestrator {
    constructor(realtimeChannel) {
        this.channel = realtimeChannel;
    }

    /**
     * Spawns a structured, collaborative prompt on the presentation screen
     */
    presentDiagnosticPrompt(cardId) {
        const dialogueFramework = {
            cardId: cardId,
            promptHeading: "Subsurface Historic Discrepancy Detected",
            conversationalHook: "Our background model shows deep continuous migration along the rail vector starting in 1890. To align our liability baselines with your treaty allocations, which operational framework matches your historical position?",
            
            paths: [
                {
                    token: "PATH_A_REMEDIATION",
                    label: "Historical Localized Remediation",
                    followUpQuestion: "Understood. What specific pre-1970 engineering interventions or containment cutoffs should the agent factor into the migration model to correct the current plume geometry?"
                },
                {
                    token: "PATH_B_TRANSFER",
                    label: "Prior Liability Apportionment",
                    followUpQuestion: "Excellent. Which predecessor rail operator or industrial entity holds the underlying indemnity block according to your active treaty exclusions?"
                },
                {
                    token: "PATH_C_INFRASTRUCTURE",
                    label: "Alternative Infrastructure Corridor",
                    followUpQuestion: "Got it. If the grid lockout isn't tied to this vector, what alternative bypass route does your risk team propose to feed the port cranes without disrupting the trackside soil?"
                }
            ]
        };

        this.channel.send({
            type: 'broadcast',
            event: 'render_dialogue_ui',
            payload: dialogueFramework
        });
    }
}

export { RealtimeOrchestrator, DialogueOrchestrator };

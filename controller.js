/**
 * Gateway Forensic Platform - Administrative Controller Console
 * File: /main/controller.js
 */
import { RealtimeOrchestrator } from './realtimeAgent.js';

class AdminForensicController {
    /**
     * @param {string} nodeKey - The target industrial node (e.g., 'newark')
     */
    constructor(nodeKey) {
        this.nodeKey = nodeKey;
        this.orchestrator = new RealtimeOrchestrator(nodeKey);
        console.log(`🎛️ [CONTROL_INITIALIZED]: Admin console armed for node: ${nodeKey.toUpperCase()}`);
    }

    /**
     * Phase 1: Shift the presentation screen to the modern VOC plume map
     * Use this when initiating the core regional risk overview.
     */
    initiatePlumeOverview() {
        console.log("⚡ [COMMAND]: Deploying standard visual VOC plume map...");
        this.orchestrator.broadcastStageChange('VOC_PLUME_OVERLAY', {
            mode: 'analytics',
            layer: 'spatial_diffusion'
        });
    }

    /**
     * Phase 2: TRIGGER THE TRAP (Hardball Protocol)
     * Call this when they try to cite standard 1970 policy exclusions or historical cleanups.
     * @param {string} specificCardId - The pre-regulation card to play (e.g., 'NWK_1890_CONDUIT')
     */
    activateHardballProtocol(specificCardId = 'NWK_1890_CONDUIT') {
        console.log(`🔥 [COMMAND]: EXECUTING HARDBALL. Unlocking pre-regulation cards for: ${specificCardId}`);
        
        this.orchestrator.broadcastStageChange('HARDBALL_ACTIVATED', {
            cardId: specificCardId,
            enforceLockout: true
        });
    }

    /**
     * Phase 3: Capture and Log Admissions
     * While they talk to justify their positions, type their comments directly into this method
     * to pipe the telemetry straight to the ledger via supabase.js
     * * @param {string} cardId - The active historical card being debated
     * @param {string} pathToken - 'PATH_A_REMEDIATION', 'PATH_B_TRANSFER', or 'PATH_C_INFRASTRUCTURE'
     * @param {string} liveStatement - Raw verbal notes or treaty citations they admit out loud
     */
    async logLiveAdmission(cardId, pathToken, liveStatement) {
        console.log("📥 [COMMAND]: Documenting verbal carrier admission...");
        
        const success = await this.orchestrator.recordCarrierResponse(cardId, pathToken, liveStatement);
        if (success) {
            console.log("🔒 [CONTROL_SUCCESS]: Statement securely anchored into the forensic registry.");
        }
    }

    /**
     * Reset: Return the presentation screen to standard view
     */
    resetPresentation() {
        console.log("🔄 [COMMAND]: Resetting display to standard map baseline.");
        this.orchestrator.broadcastStageChange('STANDARD_VIEW');
    }
}

export { AdminForensicController };

/**
 * Gateway Forensic Platform - Dialogue Capture & Strategic Ingestion
 * File: /main/realtimeAgent.js
 */

class DialogueOrchestrator {
    constructor(realtimeChannel) {
        this.channel = realtimeChannel;
    }

    /**
     * Spawns a structured, collaborative prompt on the presentation screen
     * @param {string} cardId - The target historical asset card (e.g., "NWK_1890_CONDUIT")
     */
    presentDiagnosticPrompt(cardId) {
        const dialogueFramework = {
            cardId: cardId,
            promptHeading: "Subsurface Historic Discrepancy Detected",
            conversationalHook: "Our background model shows deep continuous migration along the rail vector starting in 1890. To align our liability baselines with your treaty allocations, which operational framework matches your historical position?",
            
            // Interactive choices designed to stimulate verbal justification
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

        // Broadcast the dialogue prompt to the presentation screen
        this.channel.send({
            type: 'broadcast',
            event: 'render_dialogue_ui',
            payload: dialogueFramework
        });
    }
}

/**
 * Gateway Forensic Platform - Interactive Dialogue & Presentation Sync
 * File: /main/interact.js
 */
import { RealtimeOrchestrator } from './realtimeAgent.js';

class PresentationInteractionEngine {
    /**
     * @param {string} nodeKey - e.g., 'newark' or 'camden'
     */
    constructor(nodeKey) {
        this.nodeKey = nodeKey;
        // Connect to the shared real-time broadcast orchestrator
        this.orchestrator = new RealtimeOrchestrator(nodeKey);
        this.containerId = "dialogue-presentation-container";
    }

    /**
     * Initializes the listener on the presentation room big screen
     */
    initPresentationView() {
        console.log("🎬 [INTERACT_UI]: Presentation screen initializing interaction layer...");
        
        // Listen for the remote-control commands from your phone/console
        this.orchestrator.listenAndSyncPresentation((stage, target) => {
            if (stage === 'HARDBALL_ACTIVATED') {
                this.triggerDialogueTrap(target.cardId || "NWK_1890_CONDUIT");
            } else {
                this.clearDialogueOverlay();
            }
        });
    }

    /**
     * Renders the diagnostic dialogue prompt over the active map view
     * @param {string} cardId - The specific pre-regulation card played from the deck
     */
    triggerDialogueTrap(cardId) {
        console.log(`🎭 [UI_TRIGGER]: Rendering interactive framework for ${cardId}`);
        
        // Structure the conversational choices to guide their underwriter into a response
        const promptHeading = "Subsurface Historic Discrepancy Detected";
        const conversationalHook = "Our background model shows deep continuous migration along the rail vector starting in 1890. To align our liability baselines with your treaty allocations, which operational framework matches your historical position?";
        
        const paths = [
            { token: "PATH_A_REMEDIATION", label: "Historical Localized Remediation" },
            { token: "PATH_B_TRANSFER", label: "Prior Liability Apportionment" },
            { token: "PATH_C_INFRASTRUCTURE", label: "Alternative Infrastructure Corridor" }
        ];

        let container = document.getElementById(this.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = this.containerId;
            container.className = "forensic-dialogue-modal";
            document.body.appendChild(container);
        }

        // Build the interactive card layout dynamically
        container.innerHTML = `
            <div class="dialogue-card">
                <h3>⚠️ ${promptHeading}</h3>
                <p class="hook-text">${conversationalHook}</p>
                <div class="dialogue-options" id="dialogue-options-group">
                    ${paths.map(path => `
                        <button class="btn-dialogue-path" data-token="${path.token}">
                            ${path.label}
                        </button>
                    `).join('')}
                </div>
                <div id="dialogue-followup-area" class="followup-hidden"></div>
            </div>
        `;

        this.bindUserInteractions(cardId);
    }

    /**
     * Binds mouse clicks on the presentation screen to your backend logging capture
     */
    bindUserInteractions(cardId) {
        const buttons = document.querySelectorAll('.btn-dialogue-path');
        buttons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const selectedToken = e.target.getAttribute('data-token');
                const selectedLabel = e.target.innerText;
                
                console.log(`👆 [USER_SELECTION]: Underwriter selected ${selectedLabel}`);
                
                // Show a clean follow-up input to prompt verbal details
                this.renderFollowUpQuestion(selectedToken, selectedLabel, cardId);
            });
        });
    }

    /**
     * Encourages them to talk through a technical detail while logging their statements
     */
    renderFollowUpQuestion(token, label, cardId) {
        const followupArea = document.getElementById('dialogue-followup-area');
        let questionText = "What specific parameters or treaty records validate this position?";

        if (token === "PATH_A_REMEDIATION") {
            questionText = "Understood. What specific pre-1970 engineering interventions should the agent factor into the migration model?";
        } else if (token === "PATH_B_TRANSFER") {
            questionText = "Excellent. Which predecessor rail operator or industrial entity holds the underlying indemnity block?";
        }

        followupArea.className = "followup-visible";
        followupArea.innerHTML = `
            <p class="followup-prompt"><strong>${label}:</strong> ${questionText}</p>
            <textarea id="carrier-live-statement" placeholder="Documenting carrier rationale..."></textarea>
            <button id="btn-submit-admission" class="btn-lock-ledger">Lock Clarification to Ledger</button>
        `;

        document.getElementById('btn-submit-admission').addEventListener('click', async () => {
            const notes = document.getElementById('carrier-live-statement').value;
            
            // EXECUTE CAPTURE: Send their statement directly into your database telemetry log
            const success = await this.orchestrator.recordCarrierResponse(cardId, token, notes);
            
            if (success) {
                followupArea.innerHTML = `<p class="success-confirmation">✅ Clarification logged. Adjusting spatial asset perimeters...</p>`;
                setTimeout(() => this.clearDialogueOverlay(), 2500);
            }
        });
    }

    /**
     * Clears the interactive card overlay smoothly when moving stages
     */
    clearDialogueOverlay() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
            container.className = "forensic-dialogue-hidden";
        }
    }
}

export { PresentationInteractionEngine };

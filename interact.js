// =============================================================================
// GATEWAY FORENSIC MATRIX // INTERACTION ENGINE // LOCAL ROOT DOMAIN
// =============================================================================

export class PresentationInteractionEngine {
    constructor(context) {
        this.context = context;
        this.dataSource = './matrix_data.json';
    }

    async initPresentationView() {
        console.log(`🛰️ Matrix Engine Initialized for context: ${this.context}`);
        
        try {
            // Fetch the localized JSON data core directly from the root bypass
            const response = await fetch(this.dataSource);
            if (!response.ok) throw new Error('Data pipeline connection failed.');
            const data = await response.json();
            
            this.bindMatrixEvents(data);
        } catch (error) {
            console.error(`❌ Perimeter Breach or Missing Data Feed: ${error.message}`);
        }
    }

    bindMatrixEvents(data) {
        const panelSwiss = document.getElementById('panel-swiss');
        const panelAum = document.getElementById('panel-aum');

        if (panelSwiss && data[0]) {
            panelSwiss.addEventListener('click', () => {
                alert(`[CRITICAL AUDIT]: ${data[0].anchor_location}\nSignature: ${data[0].environmental_hazard_signature}\nAllocation: ${data[0].mitigation_fee_allocation}`);
            });
        }

        if (panelAum && data[1]) {
            panelAum.addEventListener('click', () => {
                alert(`[STRATEGIC REPOWERING]: ${data[1].anchor_location}\nOverride: ${data[1].infrastructure_override}\nFee State: ${data[1].risk_block_status}`);
            });
        }
    }
}

/**
 * Gateway Automation UI - Dashboard Module
 * Automatically renders forensic engine analytics for reinsurer review.
 */

class GatewayDashboard {
    constructor(engineInstance) {
        this.engine = engineInstance;
    }

    /**
     * Automatically pulls the latest forensic package and updates the DOM
     */
    autoRefreshMetrics() {
        const report = this.engine.generateReinsurancePackage();
        
        // Direct DOM Injection - Pulling harvested metrics "till now"
        this.updateDOMElement("total-liens-value", `$${report.summary.totalValidatedLiensValue.toLocaleString()}`);
        this.updateDOMElement("missed-expenses", `$${report.summary.totalMissedExpensesRecovered.toLocaleString()}`);
        this.updateDOMElement("nvc-count", report.summary.totalAmbientNvcCount);
        this.updateDOMElement("suppression-incidents", report.summary.systemicSuppressionIncidents);

        console.log("⚡ Dashboard automatically synced with latest forensic harvest.");
        
        // Trigger the map overlay pipeline automatically
        if (typeof window.renderHeatmap === "function") {
            window.renderHeatmap(report.fullDataset);
        }
    }

    updateDOMElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = value;
        } else {
            console.warn(`[Gateway UI] Core metric display element '#${id}' not found in HTML.`);
        }
    }
}

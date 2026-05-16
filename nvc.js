/**
 * Gateway Forensic Platform - Regional NVC Impact Matrix
 * Maps client paralysis and surrounding property degradation across specific NJ port nodes.
 */

const RegionalPortManifest = {
    "newark": {
        clientCount: 400,
        surroundingPropertyRadiusMiles: 2.5,
        gridStarvationFactor: 1.95, // Extreme load gap for heavy cranes
        healthVulnerabilityIndex: 0.88
    },
    "gloucester_city": {
        clientCount: 100,
        surroundingPropertyRadiusMiles: 1.5,
        gridStarvationFactor: 1.45,
        healthVulnerabilityIndex: 0.72
    },
    "camden": {
        clientCount: 40,
        surroundingPropertyRadiusMiles: 1.8,
        gridStarvationFactor: 1.60,
        healthVulnerabilityIndex: 0.85
    },
    "trenton": {
        clientCount: 0, // Terminal state: Port Closed
        surroundingPropertyRadiusMiles: 3.0,
        gridStarvationFactor: 2.00, // Total infrastructure abandonment penalty
        healthVulnerabilityIndex: 0.65
    },
    "paulsboro": {
        clientCount: 25, // Baseline estimation pending final audit
        surroundingPropertyRadiusMiles: 1.2,
        gridStarvationFactor: 1.30,
        healthVulnerabilityIndex: 0.78
    }
};

class RegionalNvcEngine {
    /**
     * Calculates the true NVC impact by factoring in surrounding track properties
     */
    calculateNodeImpact(nodeName, yearsSuppressed) {
        const node = RegionalPortManifest[nodeName.toLowerCase()];
        if (!node) return null;

        // Base indirect cost per paralyzed shipping client over time
        const clientLossBaseline = node.clientCount * 125000 * yearsSuppressed;
        
        // Monetize the surrounding property degradation on either side of the tracks
        const surroundingPropertyImpact = Math.round(
            (node.surroundingPropertyRadiusMiles * 5000000) * node.gridStarvationFactor * (1 + 0.08)**yearsSuppressed
        );

        // Community health liability loading
        const localizedHealthBurden = Math.round(clientLossBaseline * node.healthVulnerabilityIndex * 0.15);

        return {
            nodeName,
            indirectCosts: {
                clientParalysisLoss: clientLossBaseline,
                tracksidePropertyDiminution: surroundingPropertyImpact,
                communityHealthBurden: localizedHealthBurden
            },
            totalNvcClaimBlock: clientLossBaseline + surroundingPropertyImpact + localizedHealthBurden
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RegionalNvcEngine, RegionalPortManifest };
}

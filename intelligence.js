/**
 * Gateway Automation Engine - Forensic Actuarial Module
 * Translates suppressed data and missed expenses into standard reinsurance metrics.
 */

class GatewayForensicEngine {
    constructor(config = {}) {
        // Regulatory thresholds acting as the baseline credibility check
        this.regulatoryThresholds = config.thresholds || {
            benzene: 5.0,
            tce: 1.0,
            pce: 5.0,
            vinyl_chloride: 2.0
        };
        this.historicalRegistry = [];
    }

    /**
     * Ingests, validates, and runs an actuarial loss cost development analysis
     */
    harvestTrackSegment(rawLog) {
        const {
            segmentId,
            location,
            timeframe,
            reportedVocLevels,
            actualVocLevels,
            reportedExpenses,
            validatedOutPockets // The discovered out-of-pocket leakage
        } = rawLog;

        // 1. Map Validated Out-of-Pockets directly to IBNR Provisions
        const ibnrProvisions = validatedOutPockets.reduce((sum, entry) => sum + entry.cost, 0);
        const totalInitialIncurred = reportedExpenses + ibnrProvisions;

        // 2. Determine Data Credibility & Tail Development Factors
        let suppressionDetected = false;
        let maxBreachRatio = 1.0;
        const variances = {};

        for (const [chemical, actualValue] of Object.entries(actualVocLevels)) {
            const reportedValue = reportedVocLevels[chemical] || 0;
            const variance = actualValue - reportedValue;
            variances[chemical] = variance;

            const limit = this.regulatoryThresholds[chemical] || 1.0;
            if (actualValue >= limit) {
                const ratio = actualValue / limit;
                if (ratio > maxBreachRatio) maxBreachRatio = ratio;
                if (reportedValue < limit) {
                    suppressionDetected = true;
                }
            }
        }

        const classification = (suppressionDetected || ibnrProvisions > 50000) ? "LIEN" : "NVC";

        // 3. ACTUARIAL METHODOLOGY LAYERING
        // Credibility Factor (Z): 1.0 is pristine data, lower means the primary carrier's data is untrusted
        const credibilityFactor = suppressionDetected ? parseFloat((1 / (1 + (maxBreachRatio * 0.15))).toFixed(2)) : 1.0;
        
        // Tail Development Factor (DF): Multiplier for long-tail latent environmental decay
        const tailDevelopmentFactor = suppressionDetected ? parseFloat((1.2 + (maxBreachRatio * 0.05)).toFixed(2)) : 1.05;

        // Ultimate Loss Cost Calculation: (Reported + IBNR) * Tail Development Factor
        const ultimateLossCost = Math.round(totalInitialIncurred * tailDevelopmentFactor);

        const forensicRecord = {
            segmentId,
            location,
            timeframe,
            metrics: { reportedVocLevels, actualVocLevels, variances },
            financials: {
                reportedExpenses,
                ibnrProvisions,
                totalInitialIncurred,
                breakdown: validatedOutPockets,
                actuarialPricing: {
                    credibilityFactor,
                    tailDevelopmentFactor,
                    ultimateLossCost, // Total projected liability for the premium base
                    requiredReserveLoading: ultimateLossCost - reportedExpenses
                }
            },
            audit: {
                suppressionDetected,
                classification,
                verifiedAt: new Date().toISOString()
            }
        };

        this.historicalRegistry.push(forensicRecord);
        return forensicRecord;
    }

    /**
     * Generates a structural portfolio risk feed for direct integration into reinsurance models
     */
    generateReinsurancePackage() {
        let globalLiensTotal = 0;
        let globalNvcCount = 0;
        let globalIbnrTotal = 0;
        let aggregateUltimateLossCost = 0;
        const criticalAuditTargets = [];

        this.historicalRegistry.forEach(record => {
            globalIbnrTotal += record.financials.ibnrProvisions;
            aggregateUltimateLossCost += record.financials.actuarialPricing.ultimateLossCost;

            if (record.audit.classification === "LIEN") {
                globalLiensTotal += record.financials.actuarialPricing.ultimateLossCost;
                if (record.audit.suppressionDetected) {
                    criticalAuditTargets.push({
                        location: record.location,
                        timeframe: record.timeframe,
                        credibilityFactor: record.financials.actuarialPricing.credibilityFactor,
                        ultimateLossCost: record.financials.actuarialPricing.ultimateLossCost
                    });
                }
            } else {
                globalNvcCount++;
            }
        });

        return {
            reportGenerated: new Date().toISOString(),
            actuarialSummary: {
                portfolioCredibilityScore: parseFloat((this.historicalRegistry.reduce((acc, r) => acc + r.financials.actuarialPricing.credibilityFactor, 0) / this.historicalRegistry.length || 0).toFixed(2)),
                totalIbnrIdentified: globalIbnrTotal,
                aggregateUltimateLossCost: aggregateUltimateLossCost // The macro number driving the premium increase
            },
            summary: {
                totalValidatedLiensValue: globalLiensTotal,
                totalAmbientNvcCount: globalNvcCount,
                systemicSuppressionIncidents: criticalAuditTargets.length
            },
            forensicTargets: criticalAuditTargets,
            fullDataset: this.historicalRegistry
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GatewayForensicEngine;
}

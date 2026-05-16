 /**
 * Gateway Automation Engine - Forensic Intelligence Module
 * Tracks VOC data suppression, identifies flaws, and validates missed expenses over time.
 */

class GatewayForensicEngine {
    constructor(config = {}) {
        // NJDEP or typical regulatory action levels (in ppb/ppm)
        this.regulatoryThresholds = config.thresholds || {
            benzene: 5.0,
            tce: 1.0,
            pce: 5.0,
            vinyl_chloride: 2.0
        };
        this.historicalRegistry = [];
    }

    /**
     * Harvests and ingests raw environmental tracking data along the rail corridors.
     * Automatically identifies historical gaps and uncalculated out-of-pocket liabilities.
     */
    harvestTrackSegment(rawLog) {
        const {
            segmentId,
            location,
            timeframe,          // e.g., "2020-2026"
            reportedVocLevels,   // What the official logs claimed
            actualVocLevels,     // What your sensors/evidence actually found
            reportedExpenses,    // Suppressed or understated baseline costs
            validatedOutPockets  // Array of actual missed expenses discovered: [{item: '', cost: 0}]
        } = rawLog;

        // 1. Calculate the financial leakage (Missed Expenses)
        const totalMissedExpenses = validatedOutPockets.reduce((sum, entry) => sum + entry.cost, 0);
        const totalActualFinancialImpact = reportedExpenses + totalMissedExpenses;

        // 2. Identify Data Suppression & Inaccuracies
        let suppressionDetected = false;
        const variances = {};

        for (const [chemical, actualValue] of Object.entries(actualVocLevels)) {
            const reportedValue = reportedVocLevels[chemical] || 0;
            const variance = actualValue - reportedValue;
            variances[chemical] = variance;

            const limit = this.regulatoryThresholds[chemical] || 1.0;
            // If actual levels breach thresholds while reported values hid them -> Suppression Flag
            if (actualValue >= limit && reportedValue < limit) {
                suppressionDetected = true;
            }
        }

        // 3. Automated Classification: Lien vs. NVC
        // High variance/suppression or heavy out-of-pocket financial leaks graduate immediately to a Lien.
        const classification = (suppressionDetected || totalMissedExpenses > 50000) ? "LIEN" : "NVC";

        const forensicRecord = {
            segmentId,
            location,
            timeframe,
            metrics: {
                reportedVocLevels,
                actualVocLevels,
                variances
            },
            financials: {
                reportedExpenses,
                totalMissedExpenses,
                totalActualFinancialImpact,
                breakdown: validatedOutPockets
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
     * Compiles the entire historical audit up "till now" (2026) into an ironclad reinsurance report.
     */
    generateReinsurancePackage() {
        let globalLiensTotal = 0;
        let globalNvcCount = 0;
        let globalMissedExpensesTotal = 0;
        const criticalSuppressionZones = [];

        this.historicalRegistry.forEach(record => {
            globalMissedExpensesTotal += record.financials.totalMissedExpenses;

            if (record.audit.classification === "LIEN") {
                globalLiensTotal += record.financials.totalActualFinancialImpact;
                if (record.audit.suppressionDetected) {
                    criticalSuppressionZones.push({
                        location: record.location,
                        timeframe: record.timeframe,
                        financialLeak: record.financials.totalMissedExpenses
                    });
                }
            } else {
                globalNvcCount++;
            }
        });

        return {
            reportGenerated: new Date().toISOString(),
            summary: {
                totalValidatedLiensValue: globalLiensTotal,
                totalMissedExpensesRecovered: globalMissedExpensesTotal,
                totalAmbientNvcCount: globalNvcCount,
                systemicSuppressionIncidents: criticalSuppressionZones.length
            },
            forensicTargets: criticalSuppressionZones,
            fullDataset: this.historicalRegistry
        };
    }
}

// Export for use in app.js and dashboard.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GatewayForensicEngine;
}

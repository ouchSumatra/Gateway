/**
 * Gateway Automation Platform - Main Ingestion Pipeline
 * Feeds raw historical transit corridor data into the Forensic Actuarial Engine.
 */

// Instantiate our updated modules
const engine = new GatewayForensicEngine();
const uiDashboard = new GatewayDashboard(engine);

// 2026 Forensic Ingestion Stream - High Stakes Data vs. Reality
const historicalTrackBatches = [
    {
        segmentId: "NJ-TRANSIT-09",
        location: "Newark Rail Corridor (Milepost 4.2 - 6.8)",
        timeframe: "2021 - 2026",
        reportedVocLevels: { benzene: 0.4, tce: 0.1, vinyl_chloride: 0.0 }, // Clean baseline paper trail
        actualVocLevels: { benzene: 14.2, tce: 4.8, vinyl_chloride: 3.2 },   // The validated forensic reality
        reportedExpenses: 35000, // Minimal annual oversight costs logged
        validatedOutPockets: [
            { item: "Undocumented sub-slab depressurization infrastructure", cost: 185000 },
            { item: "Omitted third-party monitoring & litigation reserve allocations", cost: 95000 },
            { item: "Hidden structural rail-bed degradation due to corrosive plume", cost: 120000 }
        ]
    },
    {
        segmentId: "NJ-CONRAIL-04",
        location: "Camden Yards Industrial Track",
        timeframe: "2022 - 2026",
        reportedVocLevels: { benzene: 1.1, pce: 0.5 },
        actualVocLevels: { benzene: 2.3, pce: 1.8 }, // Elevated but staying below major regulatory thresholds
        reportedExpenses: 62000,
        validatedOutPockets: [
            { item: "Standard exploratory boring assessments", cost: 15000 }
        ]
    }
];

console.log("🚀 Gateway Production Pipeline: Initializing Actuarial Asset Harvest...");
console.log("=========================================================================");

// 1. Process and run the segments through the engine loop
historicalTrackBatches.forEach(batch => {
    console.log(`\n[INGESTING] Processing Segment: ${batch.segmentId} - ${batch.location}`);
    const analyticalResult = engine.harvestTrackSegment(batch);
    
    // Quick validation checkpoint per track line
    console.log(`▸ Forensic Classification: ${analyticalResult.audit.classification}`);
    console.log(`▸ Data Credibility Score (Z): ${analyticalResult.financials.actuarialPricing.credibilityFactor}`);
    console.log(`▸ Tail Development Factor (DF): ${analyticalResult.financials.actuarialPricing.tailDevelopmentFactor}`);
    console.log(`▸ Calculated Ultimate Loss Cost: $${analyticalResult.financials.actuarialPricing.ultimateLossCost.toLocaleString()}`);
});

console.log("\n=========================================================================");
console.log("⚡ Compiling Live Reinsurance-as-a-Service (RaaS) API Package...");

// 2. Extract the unified portfolio package that gets passed to the reinsurer
const reinsurancePackage = engine.generateReinsurancePackage();

console.log("\n[RAAS TELEMETRY FEED OUTPUT]:");
console.log(JSON.stringify(reinsurancePackage.actuarialSummary, null, 4));

// 3. Automatically synchronize and paint the UI dashboards/heatmaps
uiDashboard.autoRefreshMetrics();

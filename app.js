// Example data injection inside app.js
const engine = new GatewayForensicEngine();

// Ingesting a real-world track segment with hidden expenses and suppressed data
const processedData = engine.harvestTrackSegment({
    segmentId: "NJ-TRANSIT-09",
    location: "Newark Rail Corridor",
    timeframe: "2022 - 2026",
    reportedVocLevels: { benzene: 0.5, tce: 0.2 }, // The official inaccurate record
    actualVocLevels: { benzene: 8.4, tce: 4.1 },   // Your harvested forensic evidence
    reportedExpenses: 12000, 
    validatedOutPockets: [
        { item: "Undocumented localized soil vapor mitigation", cost: 85000 },
        { item: "Unreported baseline testing adjustments", cost: 14000 }
    ]
});

console.log("Automated Classification:", processedData.audit.classification); // Outputs: LIEN
console.log("Forensic Report Package for Reinsurer:", engine.generateReinsurancePackage());

// Parcel Interaction Module
// Connects map clicks → intelligence panel → NVC → risk → evidence

import { loadParcelIntel } from "./intelligence.js";
import { renderRisk } from "./risk.js";
import { renderNVC } from "./nvc.js";
import { generateEvidence } from "./evidence.js";

function attachParcelInteractions(map, parcelLayer) {
    parcelLayer.eachLayer(layer => {
        layer.on("click", () => {
            const parcel = {
                id: layer.options.parcelId,
                coords: layer.getLatLng()
                    ? [layer.getLatLng().lat, layer.getLatLng().lng]
                    : [0, 0],
                contaminated: true,
                inCorridor: true,
                status: layer.options.status || "unknown"
            };

            // Load intelligence panel
            loadParcelIntel(parcel.id);

            // Load NVC
            renderNVC(parcel);

            // Load risk
            renderRisk(parcel);

            // Auto-generate evidence packet
            generateEvidence(parcel.id);

            // Scroll to intelligence panel
            const intel = document.getElementById("intel-block");
            if (intel) intel.scrollIntoView({ behavior: "smooth" });
        });
    });
}

export { attachParcelInteractions };

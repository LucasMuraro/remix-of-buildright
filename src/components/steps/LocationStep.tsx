import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";

const regions = [
  { name: "Northeast", states: ["NY", "NJ", "CT", "MA", "PA", "ME", "VT", "NH", "RI"], multiplier: 1.25, reason: "High labor costs, strict building codes" },
  { name: "West Coast", states: ["CA", "WA", "OR"], multiplier: 1.20, reason: "High material and labor costs" },
  { name: "Southeast", states: ["FL", "GA", "NC", "SC", "VA", "TN", "AL", "MS", "LA", "AR", "KY"], multiplier: 0.95, reason: "Moderate costs, competitive market" },
  { name: "Midwest", states: ["IL", "OH", "MI", "IN", "WI", "MN", "IA", "MO", "KS", "NE", "ND", "SD"], multiplier: 0.90, reason: "Lower costs, strong contractor availability" },
  { name: "Southwest", states: ["TX", "AZ", "NM", "OK"], multiplier: 0.92, reason: "Competitive pricing, growing markets" },
  { name: "Mountain", states: ["CO", "UT", "ID", "MT", "WY", "NV"], multiplier: 1.05, reason: "Material transport costs, specialized labor" },
];

// Simple zip-to-region mapping (first digit)
const zipToRegion = (zip: string): typeof regions[0] | null => {
  const first = parseInt(zip[0]);
  if ([0, 1].includes(first)) return regions[0]; // Northeast
  if ([2, 3].includes(first)) return regions[2]; // Southeast
  if ([4, 5, 6].includes(first)) return regions[3]; // Midwest
  if ([7].includes(first)) return regions[4]; // Southwest
  if ([8].includes(first)) return regions[5]; // Mountain
  if ([9].includes(first)) return regions[1]; // West Coast
  return null;
};

interface Props {
  onRegionSelect: (name: string, mult: number) => void;
  selectedRegion: string | null;
}

const LocationStep = ({ onRegionSelect, selectedRegion }: Props) => {
  const [zip, setZip] = useState("");
  const [identified, setIdentified] = useState<typeof regions[0] | null>(null);

  const handleZipChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 5);
    setZip(cleaned);
    if (cleaned.length === 5) {
      const region = zipToRegion(cleaned);
      if (region) {
        setIdentified(region);
        onRegionSelect(region.name, region.multiplier);
      }
    } else {
      setIdentified(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12"
    >
      <div className="bg-slate-50 rounded-xl p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-3">Your Location</h2>
        <p className="text-muted-foreground text-center mb-8">Construction costs vary significantly by region</p>

        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-xs">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={zip}
              onChange={(e) => handleZipChange(e.target.value)}
              placeholder="Enter zip code"
              className="w-full text-xl md:text-2xl text-center pl-12 pr-4 py-4 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-amber-200 transition-all outline-none bg-card"
            />
          </div>
        </div>

        <AnimatePresence>
          {identified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 bg-card rounded-lg p-6 border-2 border-primary"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xl font-bold text-foreground">{identified.name} Region</p>
                  <p className="text-sm text-muted-foreground mt-1">{identified.reason}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">{identified.multiplier}x</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    identified.multiplier > 1
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {identified.multiplier > 1
                      ? `${Math.round((identified.multiplier - 1) * 100)}% above avg`
                      : `${Math.round((1 - identified.multiplier) * 100)}% below avg`}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!identified && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Or select a region manually:
          </p>
        )}
        {!identified && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {regions.map((r) => (
              <button
                key={r.name}
                onClick={() => {
                  setIdentified(r);
                  onRegionSelect(r.name, r.multiplier);
                }}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  selectedRegion === r.name
                    ? "border-primary bg-amber-50"
                    : "border-slate-200 hover:border-primary bg-card"
                }`}
              >
                {r.name}
                <span className="block text-xs text-muted-foreground">{r.multiplier}x</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LocationStep;

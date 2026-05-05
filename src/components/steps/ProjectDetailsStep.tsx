import { motion } from "framer-motion";
import { useState } from "react";

const complexityLevels = [
  { id: "simple", name: "Simple", desc: "Basic finishes, minimal structural changes", multiplier: 0.85 },
  { id: "standard", name: "Standard", desc: "Mid-range finishes, moderate complexity", multiplier: 1.0 },
  { id: "complex", name: "Complex", desc: "Custom features, significant structural work", multiplier: 1.35 },
];

interface Props {
  sqft: number;
  complexity: string;
  onSqftChange: (v: number) => void;
  onComplexityChange: (id: string, mult: number) => void;
}

const ProjectDetailsStep = ({ sqft, complexity, onSqftChange, onComplexityChange }: Props) => {
  const [sqftError, setSqftError] = useState("");

  const handleSqftChange = (val: string) => {
    const num = parseInt(val) || 0;
    if (num > 10000) {
      setSqftError("Maximum 10,000 sq ft");
    } else if (num > 0 && num < 100) {
      setSqftError("Minimum 100 sq ft");
    } else {
      setSqftError("");
    }
    onSqftChange(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12"
    >
      <div className="bg-card rounded-xl shadow-xl p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Project Details</h2>
          <p className="text-muted-foreground">Help us size your project accurately</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Square Footage
          </label>
          <input
            type="number"
            value={sqft || ""}
            onChange={(e) => handleSqftChange(e.target.value)}
            placeholder="e.g. 500"
            min={100}
            max={10000}
            className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-foreground placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-amber-200 transition-all outline-none"
          />
          {sqftError ? (
            <p className="text-sm text-destructive mt-1">{sqftError}</p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">Between 100 and 10,000 sq ft</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Project Complexity
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {complexityLevels.map((level) => {
              const isSelected = complexity === level.id;
              return (
                <motion.button
                  key={level.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onComplexityChange(level.id, level.multiplier)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-amber-50 shadow-md"
                      : "border-slate-200 bg-card hover:border-primary"
                  }`}
                >
                  <h4 className="font-semibold text-foreground mb-1">{level.name}</h4>
                  <p className="text-xs text-muted-foreground">{level.desc}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-amber-600">{level.multiplier}x</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailsStep;

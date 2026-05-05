import { motion } from "framer-motion";

const tiers = [
  {
    id: "budget",
    name: "Budget",
    multiplier: 0.8,
    desc: "Value-focused materials that meet code",
    examples: ["Stock cabinets", "Laminate counters", "Standard fixtures"],
    bestFor: "Rentals, flips, or tight budgets",
    color: "text-slate-700",
  },
  {
    id: "standard",
    name: "Standard",
    multiplier: 1.0,
    desc: "Quality materials with good durability",
    examples: ["Semi-custom cabinets", "Quartz counters", "Mid-range fixtures"],
    bestFor: "Owner-occupied homes, balanced quality",
    popular: true,
    color: "text-amber-600",
  },
  {
    id: "premium",
    name: "Premium",
    multiplier: 1.3,
    desc: "High-end finishes and top-tier materials",
    examples: ["Custom cabinets", "Granite/marble", "Designer fixtures"],
    bestFor: "Luxury homes, maximum value",
    color: "text-blue-600",
  },
];

interface Props {
  selected: string | null;
  onSelect: (id: string, mult: number) => void;
}

const MaterialTierStep = ({ selected, onSelect }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-3">Choose Material Tier</h2>
      <p className="text-muted-foreground text-center mb-10">Material quality significantly impacts your total cost</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier, i) => {
          const isSelected = selected === tier.id;
          return (
            <motion.button
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(tier.id, tier.multiplier)}
              className={`relative text-left rounded-xl p-6 border-2 transition-all ${
                isSelected
                  ? "border-primary bg-amber-50 shadow-xl scale-[1.02]"
                  : "border-slate-200 bg-card hover:border-primary"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold shadow-md">
                  Most Popular
                </span>
              )}
              <h3 className={`text-2xl font-bold mb-1 ${tier.color}`}>{tier.name}</h3>
              <p className="text-lg font-semibold text-muted-foreground mb-3">{tier.multiplier}x cost</p>
              <p className="text-sm text-muted-foreground mb-4">{tier.desc}</p>
              <ul className="space-y-2 mb-4">
                {tier.examples.map((ex) => (
                  <li key={ex} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm italic text-muted-foreground">Best for: {tier.bestFor}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MaterialTierStep;

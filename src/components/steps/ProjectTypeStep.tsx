import { motion } from "framer-motion";
import { UtensilsCrossed, Bath, Home, Warehouse, TreePine, Building2, HardHat, Car } from "lucide-react";

const projectTypes = [
  { id: "kitchen", name: "Kitchen Remodel", desc: "Transform your kitchen with new cabinets, countertops, and appliances", icon: UtensilsCrossed, baseCost: 250 },
  { id: "bathroom", name: "Bathroom Remodel", desc: "Upgrade fixtures, tile, and vanities for a modern bathroom", icon: Bath, baseCost: 200 },
  { id: "addition", name: "Home Addition", desc: "Add square footage with a room addition or second story", icon: Home, baseCost: 300 },
  { id: "basement", name: "Basement Finishing", desc: "Convert unfinished basement into livable space", icon: Warehouse, baseCost: 75 },
  { id: "deck", name: "Deck or Patio", desc: "Outdoor living space with quality materials and craftsmanship", icon: TreePine, baseCost: 60 },
  { id: "new", name: "New Construction", desc: "Ground-up residential construction project", icon: Building2, baseCost: 200 },
  { id: "roof", name: "Roof Replacement", desc: "Full roof tear-off and replacement with new materials", icon: HardHat, baseCost: 10 },
  { id: "garage", name: "Garage Construction", desc: "Detached or attached garage with options for finishes", icon: Car, baseCost: 80 },
];

interface Props {
  selected: string | null;
  onSelect: (id: string, baseCost: number) => void;
}

const ProjectTypeStep = ({ selected, onSelect }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-3">What type of project?</h2>
      <p className="text-muted-foreground text-center mb-10">Select the category that best matches your project</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {projectTypes.map((type, i) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(type.id, type.baseCost)}
              className={`text-left p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-primary bg-amber-50 shadow-lg"
                  : "border-slate-200 bg-card hover:border-primary"
              }`}
            >
              <Icon className={`w-10 h-10 md:w-12 md:h-12 mb-4 ${isSelected ? "text-amber-600" : "text-amber-400"}`} />
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">{type.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{type.desc}</p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export { projectTypes };
export default ProjectTypeStep;

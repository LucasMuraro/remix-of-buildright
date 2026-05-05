import { motion } from "framer-motion";
import { ClipboardList, SlidersHorizontal, BarChart3, Handshake, Info } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Select Your Project", desc: "Choose from common construction projects or describe your custom needs" },
  { icon: SlidersHorizontal, title: "Add Details", desc: "Input square footage, complexity, and material preferences" },
  { icon: BarChart3, title: "Get Instant Estimate", desc: "Receive a detailed cost breakdown based on real project data" },
  { icon: Handshake, title: "Connect with Pro", desc: "Optional: Get matched with vetted contractors in your area" },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="bg-slate-50 py-16 md:py-20 px-4 md:px-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">How It Works</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-card rounded-xl p-6 shadow-md text-center"
            >
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 text-center p-4 bg-blue-50 border-2 border-blue-100 rounded-lg max-w-3xl mx-auto flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600 text-left">
          Our estimates are built from 15,000+ completed projects across all 50 states, updated monthly with current material and labor costs.
        </p>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;

import { motion } from "framer-motion";
import { Calculator, BarChart3, Users, Target } from "lucide-react";

interface Props {
  onStart: () => void;
}

const trustItems = [
  { icon: Calculator, label: "12,847 estimates this month" },
  { icon: Target, label: "±15% accuracy rating" },
  { icon: Users, label: "2,400+ contractors nationwide" },
];

const HeroSection = ({ onStart }: Props) => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-rule='evenodd'%3E%3Cpath d='M0 0h1v40H0zM39 0h1v40h-1zM0 0h40v1H0zM0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E\")",
      }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6"
            >
              Your project could cost
              <br />
              <span className="text-amber-500">less than you think</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-4 max-w-lg leading-relaxed"
            >
              Professional, accurate estimates that help you plan your construction project with confidence. Get your ballpark cost in 3 minutes.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm text-muted-foreground mb-8 max-w-lg"
            >
              From kitchen remodels to new builds — instant estimates based on real project data. No spreadsheets, no guesswork.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <button
                onClick={onStart}
                className="bg-primary hover:bg-amber-600 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all active:scale-95"
              >
                Get Your Estimate
              </button>
              <a
                href="#how-it-works"
                className="text-amber-600 font-semibold px-8 py-4 rounded-lg text-lg hover:underline underline-offset-4 transition-all text-center"
              >
                Learn how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-6 md:gap-8"
            >
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right - Preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden lg:block"
          >
            <div className="bg-card rounded-2xl shadow-2xl p-8 border border-slate-200 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="mt-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-card">
                  <p className="text-slate-400 text-sm">Estimated Cost</p>
                  <p className="text-3xl font-bold font-mono mt-1">$47,500</p>
                  <p className="text-slate-400 text-sm mt-1">Range: $40,375 – $54,625</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Materials</span>
                      <span>$19,000</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[40%]" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Labor</span>
                      <span>$21,375</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[45%]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold shadow-lg text-sm">
                ±15% Accuracy
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

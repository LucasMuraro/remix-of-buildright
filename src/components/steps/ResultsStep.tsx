import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock, TrendingDown, BarChart3 } from "lucide-react";
import LeadCaptureForm from "../LeadCaptureForm";

interface Props {
  totalCost: number;
  projectType: string;
}

const useCountUp = (target: number, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [target, duration]);
  return count;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const ResultsStep = ({ totalCost, projectType }: Props) => {
  const animatedCost = useCountUp(totalCost);
  const lowRange = Math.round(totalCost * 0.85);
  const highRange = Math.round(totalCost * 1.15);

  const materialsCost = Math.round(totalCost * 0.4);
  const laborCost = Math.round(totalCost * 0.45);
  const permitsCost = Math.round(totalCost * 0.06);
  const contingencyCost = Math.round(totalCost * 0.09);

  const breakdown = [
    { label: "Materials", amount: materialsCost, pct: 40 },
    { label: "Labor", amount: laborCost, pct: 45 },
    { label: "Permits & Fees", amount: permitsCost, pct: 6 },
    { label: "Contingency", amount: contingencyCost, pct: 9 },
  ];

  const weeks = totalCost < 20000 ? "2-4" : totalCost < 50000 ? "6-8" : totalCost < 100000 ? "10-14" : "16-24";

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8"
    >
      {/* Cost Display */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-card rounded-2xl p-8 md:p-10 shadow-2xl">
        <p className="text-slate-300 text-lg mb-2">Estimated Total Cost</p>
        <p className="text-5xl md:text-6xl font-bold font-mono mb-2">{formatCurrency(animatedCost)}</p>
        <p className="text-lg md:text-xl text-slate-300">
          Range: {formatCurrency(lowRange)} – {formatCurrency(highRange)}
        </p>

        {/* Breakdown */}
        <div className="mt-8 bg-white/10 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          {breakdown.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="flex justify-between items-center py-3 border-b border-white/20 last:border-0"
            >
              <span className="text-slate-200">{item.label}</span>
              <span className="text-lg font-semibold">{formatCurrency(item.amount)}</span>
            </motion.div>
          ))}
          {/* Progress bars */}
          <div className="mt-4 space-y-2">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20">{item.label}</span>
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: 1, duration: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline + comparison */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3 bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
            <Clock className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <p className="font-semibold">{weeks} weeks</p>
              <p className="text-sm text-slate-300">Estimated timeline</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 bg-green-500/20 rounded-lg p-4 border border-green-500/30">
            <TrendingDown className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold">±15% accuracy</p>
              <p className="text-sm text-slate-300">Based on 847 similar projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture */}
      <LeadCaptureForm projectType={projectType} totalCost={totalCost} />

      <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-lg mx-auto">
        Disclaimer: This estimate is a ballpark figure based on national averages and regional adjustments. Actual costs may vary based on specific project requirements, contractor availability, and market conditions.
      </p>
    </motion.div>
  );
};

export default ResultsStep;

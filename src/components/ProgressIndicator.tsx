import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = ["Project Type", "Project Details", "Materials", "Location", "Results"];

interface ProgressIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const ProgressIndicator = ({ currentStep, onStepClick }: ProgressIndicatorProps) => {
  return (
    <div className="sticky top-0 z-50 bg-card shadow-md py-4 px-4 md:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-1 md:gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={step} className="flex items-center">
              <button
                onClick={() => isCompleted && onStepClick(index)}
                className={`flex items-center gap-1 md:gap-2 ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
                disabled={!isCompleted}
              >
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? "bg-green-500 text-primary-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : index + 1}
                </div>
                <span className="hidden md:inline text-sm font-medium text-slate-600">{step}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`w-6 md:w-12 h-1 mx-1 md:mx-2 rounded-full transition-all ${
                    isCompleted ? "bg-green-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-primary"
        animate={{ width: `${((currentStep) / steps.length) * 100}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default ProgressIndicator;

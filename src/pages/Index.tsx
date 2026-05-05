import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import ProgressIndicator from "@/components/ProgressIndicator";
import ProjectTypeStep from "@/components/steps/ProjectTypeStep";
import ProjectDetailsStep from "@/components/steps/ProjectDetailsStep";
import MaterialTierStep from "@/components/steps/MaterialTierStep";
import LocationStep from "@/components/steps/LocationStep";
import ResultsStep from "@/components/steps/ResultsStep";

const Index = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const calcRef = useRef<HTMLDivElement>(null);

  // Estimation state
  const [projectType, setProjectType] = useState<string | null>(null);
  const [baseCostPerSqft, setBaseCostPerSqft] = useState(0);
  const [sqft, setSqft] = useState(0);
  const [complexity, setComplexity] = useState("standard");
  const [complexityMult, setComplexityMult] = useState(1);
  const [materialTier, setMaterialTier] = useState<string | null>(null);
  const [materialMult, setMaterialMult] = useState(1);
  const [region, setRegion] = useState<string | null>(null);
  const [regionMult, setRegionMult] = useState(1);

  const totalCost = Math.round(baseCostPerSqft * sqft * complexityMult * materialMult * regionMult);

  const handleStart = () => {
    setShowCalculator(true);
    setCurrentStep(0);
    setTimeout(() => calcRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const canProceed = () => {
    if (currentStep === 0) return !!projectType;
    if (currentStep === 1) return sqft >= 100 && sqft <= 10000 && !!complexity;
    if (currentStep === 2) return !!materialTier;
    if (currentStep === 3) return !!region;
    return false;
  };

  const nextStep = () => {
    if (canProceed() && currentStep < 4) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onStart={handleStart} />

      {showCalculator && (
        <div ref={calcRef} id="calculator">
          <ProgressIndicator currentStep={currentStep} onStepClick={setCurrentStep} />

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <ProjectTypeStep
                key="step0"
                selected={projectType}
                onSelect={(id, cost) => {
                  setProjectType(id);
                  setBaseCostPerSqft(cost);
                }}
              />
            )}
            {currentStep === 1 && (
              <ProjectDetailsStep
                key="step1"
                sqft={sqft}
                complexity={complexity}
                onSqftChange={setSqft}
                onComplexityChange={(id, mult) => {
                  setComplexity(id);
                  setComplexityMult(mult);
                }}
              />
            )}
            {currentStep === 2 && (
              <MaterialTierStep
                key="step2"
                selected={materialTier}
                onSelect={(id, mult) => {
                  setMaterialTier(id);
                  setMaterialMult(mult);
                }}
              />
            )}
            {currentStep === 3 && (
              <LocationStep
                key="step3"
                selectedRegion={region}
                onRegionSelect={(name, mult) => {
                  setRegion(name);
                  setRegionMult(mult);
                }}
              />
            )}
            {currentStep === 4 && (
              <ResultsStep key="step4" totalCost={totalCost} projectType={projectType || ""} />
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {currentStep < 4 && (
            <div className="max-w-2xl mx-auto px-4 pb-12 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-primary hover:bg-amber-600 text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                Next Step
              </button>
            </div>
          )}
        </div>
      )}

      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How accurate are these estimates?", a: "Our estimates typically fall within ±15% of final project costs. Accuracy depends on project complexity and how detailed your inputs are. These are ballpark figures to help with planning — a detailed quote from a contractor will provide exact pricing." },
  { q: "Are there any hidden fees?", a: "No. This tool is completely free to use. We make money by connecting contractors with qualified leads, but using the calculator has no cost to you." },
  { q: "Do I have to provide my contact information?", a: "You can see the basic estimate without providing any information. We only ask for your details if you want a detailed quote or to connect with contractors." },
  { q: "What if my project is unique?", a: "Our estimator works best for common project types. For highly custom projects, we recommend connecting with a contractor directly for a detailed quote." },
  { q: "Can contractors see my project details?", a: "Only if you choose to share your information. Your estimate remains private unless you opt to request a detailed quote." },
  { q: "How current is your pricing data?", a: "We update our cost database monthly based on real project data, supplier pricing, and regional labor rates." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-card">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-2 border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-5 md:px-6 py-4 font-semibold text-foreground text-base md:text-lg flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                {faq.q}
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 md:px-6 py-4 bg-slate-50 text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "This tool has completely changed how I generate leads. I've gone from emailing spreadsheets to sending professional estimates in minutes. My close rate is up 40%.",
    name: "Marcus Rivera",
    title: "Rivera Renovation, Houston TX",
    initials: "MR",
  },
  {
    quote: "I embedded this on my website and now capture 15-20 qualified leads per month. The clients appreciate the transparency, and I save hours per week.",
    name: "Jennifer Walsh",
    title: "Walsh Home Builders, Denver CO",
    initials: "JW",
  },
  {
    quote: "As a solo contractor, looking professional matters. This tool makes me look like a much bigger operation, and clients love the instant feedback.",
    name: "David Park",
    title: "Park Construction Services, Charlotte NC",
    initials: "DP",
  },
];

const TestimonialsSection = () => (
  <section className="bg-slate-900 py-16 md:py-20 px-4 md:px-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-card mb-12">What Contractors Say</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-lg text-slate-200 leading-relaxed mb-6">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-card">{t.name}</p>
                <p className="text-sm text-slate-400">{t.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;

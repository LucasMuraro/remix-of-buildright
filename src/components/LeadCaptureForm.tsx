import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  projectType: string;
  totalCost: number;
}

const LeadCaptureForm = ({ projectType, totalCost }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", timeline: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) errs.phone = "Valid phone number required";
    if (!form.timeline) errs.timeline = "Please select a timeline";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length >= 7) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length >= 4) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return digits;
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">Thanks, {form.name}!</h3>
          <p className="text-muted-foreground leading-relaxed">
            Your detailed quote has been prepared. Check your email in the next 5 minutes for your comprehensive project breakdown and next steps.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Get Your Detailed Quote</h3>
          <p className="text-muted-foreground mb-6">We'll send a comprehensive breakdown with contractor recommendations</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                placeholder="John Smith"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-amber-200 transition-all outline-none"
                placeholder="(555) 123-4567"
              />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Project Timeline</label>
              <select
                value={form.timeline}
                onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-amber-200 transition-all outline-none appearance-none bg-card cursor-pointer"
              >
                <option value="">Select timeline...</option>
                <option value="immediate">Ready to start immediately</option>
                <option value="1-3">Within 1-3 months</option>
                <option value="3-6">3-6 months</option>
                <option value="6-12">6-12 months</option>
                <option value="planning">Just planning ahead</option>
              </select>
              {errors.timeline && <p className="text-sm text-destructive mt-1">{errors.timeline}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-primary hover:bg-amber-600 text-primary-foreground font-bold py-4 rounded-lg text-lg shadow-lg transition-all active:scale-95"
          >
            Get Your Detailed Quote
          </button>

          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            We respect your privacy. Your information will only be used to provide you with a detailed quote and project consultation. No spam, ever.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureForm;

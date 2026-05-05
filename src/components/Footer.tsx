import { HardHat } from "lucide-react";

const Footer = () => (
  <footer className="bg-slate-900 border-t border-white/10 py-8 px-4 md:px-8">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <HardHat className="w-6 h-6 text-primary" />
        <span className="font-bold text-card text-lg">BuildRight</span>
      </div>
      <p className="text-sm text-slate-400">© {new Date().getFullYear()} BuildRight Cost Estimator. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;

import { Link } from "react-router-dom";
import { Flame, Plus } from "lucide-react";

const Navbar = () => (
  <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
    <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <Flame className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
        <span className="font-display text-3xl tracking-wider text-gradient-sunset">
          ROLEZIM
        </span>
      </Link>
      <Link
        to="/submit"
        className="flex items-center gap-2 bg-gradient-sunset text-primary-foreground font-semibold px-4 md:px-5 py-2 rounded-full shadow-glow hover:scale-105 transition-transform text-sm md:text-base"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Divulgar Rolê</span>
        <span className="sm:hidden">Postar</span>
      </Link>
    </div>
  </header>
);

export default Navbar;

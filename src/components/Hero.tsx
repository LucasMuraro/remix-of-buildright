import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import CityPickerDialog from "./CityPickerDialog";

interface Props {
  selectedCity: string;
  onSelectCity: (slug: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const Hero = ({ selectedCity, onSelectCity, search, onSearchChange }: Props) => (
  <section className="relative overflow-hidden">
    {/* Glow blobs */}
    <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]" />
    <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-accent/30 rounded-full blur-[120px]" />

    <div className="relative max-w-5xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-8 flex flex-col items-center text-center">
      {/* Search + location bar (Sympla style) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mb-8 md:mb-10"
      >
        <div className="flex flex-col sm:flex-row gap-2 bg-card/80 backdrop-blur-md border-2 border-border rounded-2xl p-2 shadow-glow">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="O que você quer curtir? Festa, show, artista..."
              className="pl-9 pr-9 h-12 border-0 bg-transparent focus-visible:ring-0 text-base"
            />
            {search && (
              <button
                type="button"
                aria-label="Limpar busca"
                onClick={() => onSearchChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="sm:border-l border-border sm:pl-2 flex">
            <CityPickerDialog selectedSlug={selectedCity} onSelect={onSelectCity} />
          </div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-5xl md:text-7xl lg:text-8xl leading-none tracking-wide mb-4"
      >
        ONDE TÁ <span className="text-gradient-sunset">QUENTE</span>
        <br />
        HOJE À NOITE?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl"
      >
        Festas, baladas e shows do Brasil inteiro. Mural de flyers atualizado pela galera.
      </motion.p>
    </div>
  </section>
);

export default Hero;

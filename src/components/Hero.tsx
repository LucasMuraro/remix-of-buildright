import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { CAPITALS } from "@/lib/cities";
import CityPickerDialog from "./CityPickerDialog";

interface Props {
  selectedCity: string;
  onSelectCity: (slug: string) => void;
}

const Hero = ({ selectedCity, onSelectCity }: Props) => (
  <section className="relative overflow-hidden">
    {/* Glow blobs */}
    <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]" />
    <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-accent/30 rounded-full blur-[120px]" />

    <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-8">
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
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
      >
        Festas, baladas e bares das principais capitais do Brasil. Mural de flyers atualizado pela galera.
      </motion.p>

      {/* City picker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-2"
      >
        <MapPin className="w-5 h-5 text-primary" />
        <span className="text-sm uppercase tracking-widest text-muted-foreground">
          Escolha sua cidade
        </span>
      </motion.div>
      <div className="flex flex-wrap gap-2 md:gap-3 items-center">
        {CAPITALS.map((city) => {
          const active = city.slug === selectedCity;
          return (
            <button
              key={city.slug}
              onClick={() => onSelectCity(city.slug)}
              className={`px-4 md:px-5 py-2.5 rounded-full font-semibold text-sm md:text-base transition-all border-2 ${
                active
                  ? "bg-gradient-sunset text-primary-foreground border-transparent shadow-glow scale-105"
                  : "bg-card border-border text-foreground hover:border-primary/50"
              }`}
            >
              <span className="mr-1.5">{city.emoji}</span>
              {city.name}
            </button>
          );
        })}
        <CityPickerDialog selectedSlug={selectedCity} onSelect={onSelectCity} />
      </div>
    </div>
  </section>
);

export default Hero;

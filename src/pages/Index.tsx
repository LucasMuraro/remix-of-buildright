import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GenreFilter from "@/components/GenreFilter";
import FlyerGrid from "@/components/FlyerGrid";
import GenreCarousel from "@/components/GenreCarousel";
import { CITIES } from "@/lib/cities";

const Index = () => {
  const [city, setCity] = useState<string>(CITIES[0].name);
  const [genre, setGenre] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero
        selectedCity={CITIES.find((c) => c.name === city)?.slug || ""}
        onSelectCity={(slug) => {
          const found = CITIES.find((c) => c.slug === slug);
          if (found) setCity(found.name);
        }}
      />
      <GenreCarousel city={city} />
      <GenreFilter selected={genre} onSelect={setGenre} />
      <FlyerGrid city={city} genre={genre} />
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>
          <span className="font-display text-lg text-gradient-sunset tracking-wider">
            ROLEZIM
          </span>{" "}
          — feito pra galera que curte sair. © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Index;

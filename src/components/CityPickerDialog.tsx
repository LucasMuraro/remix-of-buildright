import { useState, useMemo } from "react";
import { Search, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CITIES_BY_STATE, CITIES, type City } from "@/lib/cities";

const STATE_NAMES: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia",
  CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás",
  MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais",
  PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí",
  RJ: "Rio de Janeiro", RN: "Rio Grande do Norte", RS: "Rio Grande do Sul",
  RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo",
  SE: "Sergipe", TO: "Tocantins",
};

interface Props {
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

const CityPickerDialog = ({ selectedSlug, onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const [activeState, setActiveState] = useState<string>(
    CITIES.find((c) => c.slug === selectedSlug)?.state ?? CITIES_BY_STATE[0].state
  );
  const [query, setQuery] = useState("");

  const selectedCity = CITIES.find((c) => c.slug === selectedSlug);

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [query]);

  const handlePick = (c: City) => {
    onSelect(c.slug);
    setOpen(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-border bg-card text-foreground hover:border-primary/50 transition-all text-sm md:text-base font-semibold">
          <MapPin className="w-4 h-4 text-primary" />
          {selectedCity ? `${selectedCity.emoji} ${selectedCity.name} - ${selectedCity.state}` : "Todas as cidades"}
          <span className="text-xs text-muted-foreground ml-1">▾</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Escolha uma cidade</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cidade ou estado..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {filtered ? (
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhuma cidade encontrada</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filtered.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => handlePick(c)}
                    className={`text-left px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors ${
                      c.slug === selectedSlug ? "bg-muted font-semibold" : ""
                    }`}
                  >
                    <span className="mr-2">{c.emoji}</span>
                    {c.name} <span className="text-muted-foreground">- {c.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-[140px_1fr] gap-3 overflow-hidden flex-1 min-h-0">
            <div className="overflow-y-auto border-r border-border pr-2">
              {CITIES_BY_STATE.map((g) => (
                <button
                  key={g.state}
                  onClick={() => setActiveState(g.state)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeState === g.state
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-muted"
                  }`}
                >
                  {g.state}
                  <span className="block text-xs opacity-70">{STATE_NAMES[g.state]}</span>
                </button>
              ))}
            </div>
            <div className="overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CITIES_BY_STATE.find((g) => g.state === activeState)?.cities.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => handlePick(c)}
                    className={`text-left px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors ${
                      c.slug === selectedSlug ? "bg-muted font-semibold" : ""
                    }`}
                  >
                    <span className="mr-2">{c.emoji}</span>
                    {c.name}
                    {c.isCapital && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-primary">capital</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CityPickerDialog;

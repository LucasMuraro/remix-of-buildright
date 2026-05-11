import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export type DateRange = "all" | "today" | "weekend" | "week" | "month";

const RANGES: { value: DateRange; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "today", label: "Hoje" },
  { value: "weekend", label: "Fim de semana" },
  { value: "week", label: "7 dias" },
  { value: "month", label: "30 dias" },
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (v: DateRange) => void;
}

const SearchBar = ({ search, onSearchChange, dateRange, onDateRangeChange }: Props) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-2 pb-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar evento, artista ou casa..."
            className="pl-9 pr-9 h-11"
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

        <div className="flex gap-2 overflow-x-auto md:overflow-visible -mx-1 px-1">
          {RANGES.map((r) => {
            const active = dateRange === r.value;
            return (
              <button
                key={r.value}
                onClick={() => onDateRangeChange(r.value)}
                className={`whitespace-nowrap text-xs font-semibold px-3 h-11 rounded-md border transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-card text-foreground border-border hover:border-primary/60"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

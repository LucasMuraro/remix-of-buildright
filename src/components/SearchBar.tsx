export type DateRange = "all" | "today" | "weekend" | "week" | "month";

const RANGES: { value: DateRange; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "today", label: "Hoje" },
  { value: "weekend", label: "Fim de semana" },
  { value: "week", label: "7 dias" },
  { value: "month", label: "30 dias" },
];

interface Props {
  dateRange: DateRange;
  onDateRangeChange: (v: DateRange) => void;
}

const SearchBar = ({ dateRange, onDateRangeChange }: Props) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-2 pb-4">
      <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
        {RANGES.map((r) => {
          const active = dateRange === r.value;
          return (
            <button
              key={r.value}
              onClick={() => onDateRangeChange(r.value)}
              className={`whitespace-nowrap text-xs font-semibold px-3 h-10 rounded-md border transition-colors ${
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
  );
};

export default SearchBar;


import { GENRES } from "@/lib/cities";

interface Props {
  selected: string | null;
  onSelect: (genre: string | null) => void;
}

const GenreFilter = ({ selected, onSelect }: Props) => (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
          selected === null
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        Tudo
      </button>
      {GENRES.map((g) => (
        <button
          key={g}
          onClick={() => onSelect(g)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selected === g
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {g}
        </button>
      ))}
    </div>
  </div>
);

export default GenreFilter;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import FlyerCard from "./FlyerCard";
import { Loader2, CalendarOff } from "lucide-react";
import type { DateRange } from "./SearchBar";

interface Props {
  city: string;
  genre: string | null;
  search: string;
  dateRange: DateRange;
}

function getDateBounds(range: DateRange): { from: Date; to?: Date } {
  const now = new Date();
  const from = new Date(now);
  from.setHours(0, 0, 0, 0);

  if (range === "all") return { from: now };
  if (range === "today") {
    const to = new Date(from);
    to.setHours(23, 59, 59, 999);
    return { from: now, to };
  }
  if (range === "weekend") {
    // Fri 18:00 → Sun 23:59 (covers next upcoming weekend)
    const day = now.getDay(); // 0=Sun ... 6=Sat
    const fri = new Date(from);
    const daysUntilFri = (5 - day + 7) % 7;
    fri.setDate(from.getDate() + daysUntilFri);
    fri.setHours(18, 0, 0, 0);
    const sun = new Date(fri);
    sun.setDate(fri.getDate() + 2);
    sun.setHours(23, 59, 59, 999);
    // If today is Fri/Sat/Sun, allow from now
    return { from: day >= 5 || day === 0 ? now : fri, to: sun };
  }
  if (range === "week") {
    const to = new Date(from);
    to.setDate(from.getDate() + 7);
    return { from: now, to };
  }
  if (range === "month") {
    const to = new Date(from);
    to.setDate(from.getDate() + 30);
    return { from: now, to };
  }
  return { from: now };
}

const FlyerGrid = ({ city, genre, search, dateRange }: Props) => {
  const [events, setEvents] = useState<Tables<"events">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const { from, to } = getDateBounds(dateRange);
    let q = supabase
      .from("events")
      .select("*")
      .eq("status", "approved")
      .gte("event_date", from.toISOString())
      .order("event_date", { ascending: true });

    if (to) q = q.lte("event_date", to.toISOString());
    if (city) q = q.eq("city", city);
    if (genre) q = q.eq("genre", genre);

    q.then(({ data }) => {
      setEvents(data || []);
      setLoading(false);
    });
  }, [city, genre, dateRange]);

  const filtered = search.trim()
    ? events.filter((e) => {
        const t = search.toLowerCase();
        return (
          e.title?.toLowerCase().includes(t) ||
          e.venue?.toLowerCase().includes(t) ||
          e.description?.toLowerCase().includes(t)
        );
      })
    : events;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <CalendarOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-display text-3xl mb-2">NENHUM ROLÊ POR AQUI</h3>
        <p className="text-muted-foreground">
          {search
            ? "Tente outra busca ou mude o filtro de data."
            : "Seja o primeiro a divulgar um evento nesta cidade. Cola um flyer aí!"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map((e, i) => (
          <FlyerCard key={e.id} event={e} index={i} />
        ))}
      </div>
    </div>
  );
};

export default FlyerGrid;

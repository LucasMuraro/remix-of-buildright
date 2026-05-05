import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import FlyerCard from "./FlyerCard";
import { Loader2, CalendarOff } from "lucide-react";

interface Props {
  city: string;
  genre: string | null;
}

const FlyerGrid = ({ city, genre }: Props) => {
  const [events, setEvents] = useState<Tables<"events">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let q = supabase
      .from("events")
      .select("*")
      .eq("status", "approved")
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true });

    if (city) q = q.eq("city", city);
    if (genre) q = q.eq("genre", genre);

    q.then(({ data }) => {
      setEvents(data || []);
      setLoading(false);
    });
  }, [city, genre]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <CalendarOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-display text-3xl mb-2">NENHUM ROLÊ POR AQUI</h3>
        <p className="text-muted-foreground">
          Seja o primeiro a divulgar um evento nesta cidade. Cola um flyer aí!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {events.map((e, i) => (
          <FlyerCard key={e.id} event={e} index={i} />
        ))}
      </div>
    </div>
  );
};

export default FlyerGrid;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, MapPin } from "lucide-react";

// Deterministic daily shuffle so the order rotates once per day (Sympla-style).
function dailyShuffle<T extends { id: string }>(arr: T[]): T[] {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return [...arr]
    .map((item) => {
      let h = day;
      for (let i = 0; i < item.id.length; i++) {
        h = (h * 31 + item.id.charCodeAt(i)) | 0;
      }
      return { item, key: h };
    })
    .sort((a, b) => a.key - b.key)
    .map((x) => x.item);
}

const FeaturedCarousel = () => {
  const [events, setEvents] = useState<Tables<"events">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      // Featured events from across Brazil (rotate daily).
      const { data: featured } = await supabase
        .from("events")
        .select("*")
        .eq("status", "approved")
        .eq("featured", true)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(40);

      let pool = featured || [];

      // Fallback: if not enough featured, complete with upcoming events from any city.
      if (pool.length < 6) {
        const { data: extra } = await supabase
          .from("events")
          .select("*")
          .eq("status", "approved")
          .gte("event_date", new Date().toISOString())
          .order("event_date", { ascending: true })
          .limit(20);
        const ids = new Set(pool.map((e) => e.id));
        for (const e of extra || []) {
          if (!ids.has(e.id)) pool.push(e);
        }
      }

      if (cancelled) return;
      setEvents(dailyShuffle(pool).slice(0, 12));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || events.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pt-2 pb-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="font-display text-3xl md:text-4xl tracking-wide">
          DESTAQUES <span className="text-gradient-sunset">DO BRASIL</span>
        </h2>
        <span className="text-xs text-muted-foreground hidden md:block">
          Os rolês mais quentes do país, atualizados todo dia
        </span>
      </div>

      <Carousel
        opts={{ align: "start", loop: events.length > 2 }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {events.map((e) => {
            const date = new Date(e.event_date);
            const day = date.getDate();
            const month = date
              .toLocaleDateString("pt-BR", { month: "short" })
              .replace(".", "");

            return (
              <CarouselItem
                key={e.id}
                className="pl-3 basis-[85%] sm:basis-1/2 lg:basis-1/3"
              >
                <Link
                  to={`/event/${e.id}`}
                  className="group relative block rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/60 transition-all hover:shadow-magenta"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-night">
                    {e.flyer_url ? (
                      <img
                        src={e.flyer_url}
                        alt={e.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6">
                        <h3 className="font-display text-2xl text-center text-gradient-sunset line-clamp-3">
                          {e.title}
                        </h3>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

                    {e.genre && (
                      <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-accent/90 text-accent-foreground uppercase tracking-wider">
                        {e.genre}
                      </span>
                    )}
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur rounded-lg px-2.5 py-1.5 text-center border border-border">
                      <div className="font-display text-xl leading-none text-primary">
                        {day}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {month}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display text-xl md:text-2xl tracking-wide leading-tight line-clamp-2 mb-1">
                        {e.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1">
                            {e.city}
                            {e.state ? ` - ${e.state}` : ""}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {date.toLocaleDateString("pt-BR", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4" />
        <CarouselNext className="hidden md:flex -right-4" />
      </Carousel>
    </section>
  );
};

export default FeaturedCarousel;

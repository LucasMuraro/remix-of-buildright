import { motion } from "framer-motion";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const FlyerCard = ({ event, index }: { event: Event; index: number }) => {
  const date = new Date(event.event_date);
  const day = date.getDate();
  const month = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="break-inside-avoid mb-4"
    >
      <Link
        to={`/event/${event.id}`}
        className="block group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all hover:shadow-magenta"
      >
        {event.featured && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-fire text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-glow">
            <Sparkles className="w-3 h-3" /> DESTAQUE
          </div>
        )}
        <div className="absolute top-3 right-3 z-10 bg-background/90 backdrop-blur rounded-lg px-2.5 py-1.5 text-center border border-border">
          <div className="font-display text-xl leading-none text-primary">{day}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {month}
          </div>
        </div>

        {event.flyer_url ? (
          <img
            src={event.flyer_url}
            alt={event.title}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-gradient-night flex items-center justify-center p-6">
            <h3 className="font-display text-3xl text-center text-gradient-sunset">
              {event.title}
            </h3>
          </div>
        )}

        <div className="p-4">
          <h3 className="font-display text-2xl tracking-wide leading-tight mb-2 line-clamp-2">
            {event.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{event.venue || event.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {date.toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
          {event.genre && (
            <span className="inline-block mt-3 text-xs font-semibold px-2 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
              {event.genre}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default FlyerCard;

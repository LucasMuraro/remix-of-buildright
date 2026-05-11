import { motion } from "framer-motion";
import { Calendar, MapPin, Sparkles, ExternalLink, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const FlyerCard = ({ event, index }: { event: Event; index: number }) => {
  const date = new Date(event.event_date);
  const day = date.getDate();
  const month = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

  const sourceLabel = (() => {
    if (!event.ticket_url) return null;
    try {
      const h = new URL(event.ticket_url).hostname.replace("www.", "");
      if (h.includes("sympla")) return "Sympla";
      if (h.includes("eventbrite")) return "Eventbrite";
      if (h.includes("ingresse")) return "Ingresse";
      if (h.includes("shotgun")) return "Shotgun";
      return h.split(".")[0];
    } catch {
      return null;
    }
  })();

  const cardClass =
    "flex flex-col h-full group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all hover:shadow-magenta";

  const Body = (
    <>
      {event.featured && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-gradient-fire text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-glow">
          <Sparkles className="w-2.5 h-2.5" /> TOP
        </div>
      )}
      <div className="absolute top-2 right-2 z-10 bg-background/90 backdrop-blur rounded-md px-1.5 py-1 text-center border border-border">
        <div className="font-display text-sm leading-none text-primary">{day}</div>
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
          {month}
        </div>
      </div>

      <div className="w-full aspect-square overflow-hidden bg-gradient-night flex-shrink-0 relative">
        {event.flyer_url ? (
          <img
            src={event.flyer_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-3">
            <h3 className="font-display text-lg text-center text-gradient-sunset line-clamp-4">
              {event.title}
            </h3>
          </div>
        )}
        {sourceLabel && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/90 backdrop-blur text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-foreground border border-border">
            <ExternalLink className="w-2.5 h-2.5" /> {sourceLabel}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm leading-tight mb-1.5 line-clamp-2">{event.title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="line-clamp-1">{event.venue || event.city}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>
            {date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {event.genre && (
            <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
              {event.genre}
            </span>
          )}
          {event.instagram_url && (
            <a
              href={event.instagram_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
              aria-label="Instagram do evento"
            >
              <Instagram className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="h-full"
    >
      {event.ticket_url ? (
        <a href={event.ticket_url} target="_blank" rel="noreferrer" className={cardClass}>
          {Body}
        </a>
      ) : (
        <Link to={`/event/${event.id}`} className={cardClass}>
          {Body}
        </Link>
      )}
    </motion.div>
  );
};

export default FlyerCard;

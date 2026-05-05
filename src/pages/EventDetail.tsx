import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Calendar, MapPin, Instagram, Loader2 } from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Tables<"events"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setEvent(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-32">
          <h2 className="font-display text-4xl">ROLÊ NÃO ENCONTRADO</h2>
          <Link to="/" className="text-primary mt-4 inline-block">
            ← Voltar
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(event.event_date);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl overflow-hidden bg-card border border-border">
            {event.flyer_url ? (
              <img src={event.flyer_url} alt={event.title} className="w-full" />
            ) : (
              <div className="aspect-[3/4] bg-gradient-night flex items-center justify-center p-8">
                <h2 className="font-display text-5xl text-center text-gradient-sunset">
                  {event.title}
                </h2>
              </div>
            )}
          </div>

          <div>
            {event.genre && (
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 mb-4">
                {event.genre}
              </span>
            )}
            <h1 className="font-display text-5xl md:text-6xl leading-none mb-6">
              {event.title}
            </h1>

            <div className="space-y-4 mb-8">
              <Info
                icon={Calendar}
                label="Quando"
                value={date.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <Info
                icon={MapPin}
                label="Onde"
                value={
                  <>
                    {event.venue && <div className="font-semibold">{event.venue}</div>}
                    <div className="text-muted-foreground text-sm">
                      {event.address || `${event.city} - ${event.state}`}
                    </div>
                  </>
                }
              />
            </div>

            {event.description && (
              <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                {event.description}
              </p>
            )}

            {event.instagram_url && (
              <a
                href={event.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-sunset text-primary-foreground font-semibold px-6 py-3 rounded-full shadow-glow hover:scale-105 transition-transform"
              >
                <Instagram className="w-5 h-5" /> Ver no Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex gap-3">
    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div>{value}</div>
    </div>
  </div>
);

export default EventDetail;

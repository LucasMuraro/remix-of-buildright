import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import Navbar from "@/components/Navbar";
import { Loader2, Trash2, Sparkles, Download, LogOut } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<Tables<"events">[]>([]);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!role) { toast.error("Acesso negado. Você não é admin."); navigate("/"); return; }
      setIsAdmin(true);
      setChecking(false);
      loadEvents();
    })();
  }, [navigate]);

  const loadEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    setEvents(data || []);
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from("events").update({ featured: !current }).eq("id", id);
    loadEvents();
  };

  const remove = async (id: string) => {
    if (!confirm("Apagar este evento?")) return;
    await supabase.from("events").delete().eq("id", id);
    toast.success("Evento removido");
    loadEvents();
  };

  const scrape = async () => {
    if (!scrapeUrl.includes("sympla.com.br")) {
      toast.error("Cole uma URL do Sympla");
      return;
    }
    setScraping(true);
    try {
      const { data, error } = await supabase.functions.invoke("scrape-sympla", { body: { url: scrapeUrl } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Evento importado!");
      setScrapeUrl("");
      loadEvents();
    } catch (e: any) {
      toast.error(e.message || "Erro ao importar");
    } finally {
      setScraping(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-5xl">PAINEL <span className="text-gradient-sunset">ADMIN</span></h1>
          <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        {/* Scrape importer */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" /> IMPORTAR DO SYMPLA
          </h2>
          <div className="flex gap-3">
            <input
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              placeholder="https://www.sympla.com.br/evento/..."
              className="input-rolezim flex-1"
            />
            <button
              onClick={scrape}
              disabled={scraping || !scrapeUrl}
              className="bg-gradient-sunset text-primary-foreground font-semibold px-6 rounded-xl shadow-glow disabled:opacity-50 flex items-center gap-2"
            >
              {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Importar
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Cole a URL completa de um evento no Sympla. Vamos baixar título, data, local e flyer automaticamente.
          </p>
        </div>

        {/* Events list */}
        <h2 className="font-display text-2xl mb-4">EVENTOS ({events.length})</h2>
        <div className="space-y-2">
          {events.map((e) => (
            <div key={e.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              {e.flyer_url && <img src={e.flyer_url} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{e.title}</div>
                <div className="text-sm text-muted-foreground">
                  {e.city} · {new Date(e.event_date).toLocaleDateString("pt-BR")} · {e.genre || "—"} · <span className={e.status === "approved" ? "text-green-400" : "text-yellow-400"}>{e.status}</span>
                </div>
              </div>
              <button
                onClick={() => toggleFeatured(e.id, e.featured)}
                className={`p-2 rounded-lg transition-colors ${e.featured ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                title={e.featured ? "Remover destaque" : "Destacar"}
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button onClick={() => remove(e.id)} className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;

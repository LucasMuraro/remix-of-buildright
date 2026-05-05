import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CITIES, GENRES } from "@/lib/cities";
import Navbar from "@/components/Navbar";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Submit = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: CITIES[0].name as string,
    venue: "",
    address: "",
    event_date: "",
    genre: GENRES[0] as string,
    instagram_url: "",
    submitter_email: "",
  });

  const onFile = (f: File | null) => {
    setFlyerFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.event_date || !form.city) {
      toast.error("Preencha título, cidade e data");
      return;
    }
    setSubmitting(true);
    try {
      let flyer_url: string | null = null;
      if (flyerFile) {
        const ext = flyerFile.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("flyers")
          .upload(path, flyerFile);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("flyers").getPublicUrl(path);
        flyer_url = data.publicUrl;
      }

      const cityData = CITIES.find((c) => c.name === form.city)!;
      const { error } = await supabase.from("events").insert({
        ...form,
        state: cityData.state,
        flyer_url,
        event_date: new Date(form.event_date).toISOString(),
      });
      if (error) throw error;

      setDone(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-32 px-4">
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-4" />
          <h2 className="font-display text-4xl mb-2">RECEBEMOS SEU ROLÊ!</h2>
          <p className="text-muted-foreground">Já tá no ar. Bora divulgar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="font-display text-5xl md:text-6xl mb-2">
          DIVULGA AÍ <span className="text-gradient-sunset">SEU ROLÊ</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Grátis. Sem login. Cola o flyer e seja visto.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Flyer upload */}
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider mb-2">
              Flyer / Cartaz
            </label>
            <label className="block cursor-pointer border-2 border-dashed border-border hover:border-primary rounded-xl p-6 text-center transition-colors">
              {preview ? (
                <img src={preview} alt="" className="max-h-64 mx-auto rounded-lg" />
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique pra escolher uma imagem
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <Field label="Nome do evento *">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-rolezim"
              placeholder="Ex: Sunset no Rooftop"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Cidade *">
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="input-rolezim"
              >
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estilo">
              <select
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value as any })}
                className="input-rolezim"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Data e hora *">
            <input
              required
              type="datetime-local"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="input-rolezim"
            />
          </Field>

          <Field label="Local / Casa">
            <input
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="input-rolezim"
              placeholder="Ex: Audio Club"
            />
          </Field>

          <Field label="Endereço">
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-rolezim"
              placeholder="Rua, número, bairro"
            />
          </Field>

          <Field label="Instagram do evento">
            <input
              value={form.instagram_url}
              onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              className="input-rolezim"
              placeholder="https://instagram.com/..."
            />
          </Field>

          <Field label="Descrição">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-rolezim min-h-24"
              placeholder="Line-up, open bar, atrações..."
            />
          </Field>

          <Field label="Seu email (não aparece no site)">
            <input
              type="email"
              value={form.submitter_email}
              onChange={(e) => setForm({ ...form, submitter_email: e.target.value })}
              className="input-rolezim"
              placeholder="seu@email.com"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-sunset text-primary-foreground font-bold py-4 rounded-xl text-lg shadow-glow hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
              </>
            ) : (
              "PUBLICAR ROLÊ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-semibold uppercase tracking-wider mb-2">
      {label}
    </label>
    {children}
  </div>
);

export default Submit;

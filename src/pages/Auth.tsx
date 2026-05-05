import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/admin");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className="font-display text-5xl mb-2">{mode === "login" ? "ENTRAR" : "CRIAR CONTA"}</h1>
        <p className="text-muted-foreground mb-8">Acesso restrito ao painel admin.</p>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-rolezim" />
          <input type="password" required placeholder="Senha (mín. 6 caracteres)" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-rolezim" />
          <button type="submit" disabled={loading} className="w-full bg-gradient-sunset text-primary-foreground font-bold py-3 rounded-xl shadow-glow disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 text-sm text-muted-foreground hover:text-foreground w-full text-center">
          {mode === "login" ? "Não tem conta? Criar" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
};

export default Auth;

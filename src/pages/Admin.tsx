import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Image,
  CalendarDays,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Lock,
  Mail,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminModalidades from "@/components/admin/AdminModalidades";
import { checkIsAdmin, getCurrentSession, signInAsAdmin, signOut } from "@/lib/cms";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type Module = "dashboard" | "blog" | "galeria" | "eventos" | "modalidades";

const modules: { id: Module; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "modalidades", label: "Modalidades", icon: FileText },
  { id: "galeria", label: "Galeria", icon: Image },
  { id: "eventos", label: "Eventos", icon: CalendarDays },
];

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInAsAdmin(email, password);
      onLogin();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Credenciais invalidas.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background artístico */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-primary-light" />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-foreground/[0.03] rounded-full blur-3xl" />

      {/* Card de login */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/30 shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Lock size={24} className="text-primary" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground text-sm mt-2 tracking-wide uppercase">
              Acesso restrito
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@seusite.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [active, setActive] = useState<Module>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const setAuthState = (isAdmin: boolean) => {
      if (!mounted) return;
      setAuthenticated(isAdmin);
      setCheckingAuth(false);
    };

    const validateAdminSession = async (session: Session | null) => {
      if (!session?.user) {
        setAuthState(false);
        return;
      }

      try {
        const isAdmin = await checkIsAdmin(session.user);
        setAuthState(isAdmin);

        // Não fazer signOut automático: manter logado até clicar em "Sair".
      } catch {
        setAuthState(false);
      }
    };

    const init = async () => {
      try {
        const session = await getCurrentSession();
        await validateAdminSession(session);
      } catch {
        setAuthState(false);
      }
    };

    void init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      void validateAdminSession(session);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // intentionally ignored to not block UI sign-out state
    }
    setAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Verificando acesso...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  const renderModule = () => {
    switch (active) {
      case "dashboard": return <AdminDashboard />;
      case "blog": return <AdminBlog />;
      case "modalidades": return <AdminModalidades />;
      case "galeria": return <AdminGallery />;
      case "eventos": return <AdminEvents />;
    }
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border/40 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-border/30">
          <span className="font-serif text-lg font-semibold text-primary tracking-wide">Admin Panel</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => { setActive(m.id); setSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                active === m.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <m.icon size={18} />
              {m.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border/30 space-y-1">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <ExternalLink size={18} />
            Ver Site
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border/30 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu size={22} />
            </button>
            <h1 className="font-serif text-xl font-semibold text-foreground">
              {modules.find((m) => m.id === active)?.label}
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground border border-border/40 hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            <ExternalLink size={15} />
            Ver Site
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default Admin;

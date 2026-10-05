import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ExternalLink, FileText, Layers, LayoutDashboard, Link2, LogOut, Menu, Mic, Settings, UserRound, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AdminContext, AuthCard, Notice, adminMeta, inputClass, labelClass, primaryBtn, type StaffRole,
} from "@/components/admin/admin-ui";
import { images } from "@/lib/site";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: adminMeta("Painel") }),
  component: AdminLayout,
});

type State =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "no-access"; user: User }
  | { status: "ready"; user: User; role: StaffRole };

function AdminLayout() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return setState({ status: "signed-out" });
      const { data: role } = await supabase.rpc("staff_role");
      if (!role) return setState({ status: "no-access", user: data.user });
      setState({ status: "ready", user: data.user, role: role as StaffRole });
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") load();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (state.status === "loading") {
    return <div className="flex min-h-screen items-center justify-center font-sans text-sm text-muted-foreground">Carregando…</div>;
  }
  if (state.status === "signed-out") return <LoginForm />;
  if (state.status === "no-access") {
    return (
      <AuthCard title="Acesso não autorizado">
        <p className="mb-6 text-center font-sans text-sm text-muted-foreground">
          Esta conta não tem permissão para acessar o painel.
        </p>
        <button className={`${primaryBtn} w-full`} onClick={() => supabase.auth.signOut()}>Sair</button>
      </AuthCard>
    );
  }
  return (
    <AdminContext.Provider value={{ user: state.user, role: state.role }}>
      <AdminFrame role={state.role} />
    </AdminContext.Provider>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError("E-mail ou senha incorretos. Confira e tente novamente.");
  };

  return (
    <AuthCard title="Entrar no painel">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>E-mail</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>Senha</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          <div className="mt-2 text-right">
            <Link to="/admin/recuperar-senha" className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground hover:text-accent">
              Esqueci minha senha
            </Link>
          </div>
        </div>
        {error && <Notice tone="error">{error}</Notice>}
        <button type="submit" disabled={busy} className={`${primaryBtn} w-full`}>
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </AuthCard>
  );
}

const nav = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/episodios", label: "Episódios", Icon: Mic },
  { to: "/admin/quadros", label: "Quadros", Icon: Layers },
  { to: "/admin/conteudo", label: "Conteúdo do site", Icon: FileText },
  { to: "/admin/perfil", label: "Perfil", Icon: UserRound },
  { to: "/admin/links", label: "Links e redes", Icon: Link2 },
] as const;

function AdminFrame({ role }: { role: StaffRole }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin", replace: true });
  };
  const item = "flex items-center gap-3 rounded-md px-3 py-2.5 font-sans text-[0.72rem] font-bold uppercase tracking-[0.14em] text-primary-foreground/75 transition hover:bg-primary-foreground/10 hover:text-primary-foreground";

  const menu = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Menu do painel">
      {nav.map(({ to, label, Icon, ...rest }) => (
        <Link key={to} to={to} onClick={() => setOpen(false)} className={item}
          activeOptions={{ exact: "exact" in rest }} activeProps={{ className: "bg-primary-foreground/10 !text-primary-foreground" }}>
          <Icon className="size-4" strokeWidth={1.7} /> {label}
        </Link>
      ))}
      {role === "admin" && (
        <Link to="/admin/configuracoes" onClick={() => setOpen(false)} className={item}
          activeProps={{ className: "bg-primary-foreground/10 !text-primary-foreground" }}>
          <Settings className="size-4" strokeWidth={1.7} /> Configurações
        </Link>
      )}
      <div className="my-3 border-t border-primary-foreground/15" />
      <a href="/" target="_blank" rel="noreferrer" className={item}>
        <ExternalLink className="size-4" strokeWidth={1.7} /> Ver site
      </a>
      <button type="button" onClick={signOut} className={`${item} text-left`}>
        <LogOut className="size-4" strokeWidth={1.7} /> Sair
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary/50 text-foreground lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-primary p-5 lg:flex lg:min-h-screen">
        <Brand />
        {menu}
      </aside>
      <div className="flex items-center justify-between bg-primary px-5 py-3 lg:hidden">
        <Brand compact />
        <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Fechar menu" : "Abrir menu"} className="text-primary-foreground">
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && <div className="bg-primary px-5 pb-5 lg:hidden">{menu}</div>}
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-10 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "mb-8"}`}>
      <img src={images.logo} alt="" className="size-10 rounded-full object-cover" />
      <div className="leading-tight">
        <p className="font-display text-lg font-semibold text-primary-foreground">Passaporte</p>
        <p className="font-sans text-[0.58rem] font-bold uppercase tracking-[0.28em] text-primary-foreground/60">Admin</p>
      </div>
    </div>
  );
}

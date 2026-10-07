import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Notice, PageTitle, adminMeta, ghostBtn, inputClass, labelClass, primaryBtn, useAdmin, type StaffRole,
} from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin/configuracoes")({
  head: () => ({ meta: adminMeta("Configurações") }),
  component: Settings,
});

const roleLabel = (r: StaffRole) => (r === "admin" ? "Administrador" : "Editor");
const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Nunca acessou";
const friendly = (msg: string) =>
  /Administrador ativo/.test(msg) ? "O sistema precisa manter pelo menos um Administrador ativo."
  : /duplicate|unique/i.test(msg) ? "Este e-mail já tem acesso ao painel."
  : "Não foi possível concluir. Tente novamente.";

function Settings() {
  const { role, user } = useAdmin();
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["staff"],
    enabled: role === "admin",
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_list_staff");
      if (error) throw error;
      return data ?? [];
    },
  });

  if (role !== "admin") {
    return <div><PageTitle title="Configurações" /><p className="font-sans text-sm text-muted-foreground">Esta área é exclusiva do perfil Administrador.</p></div>;
  }

  const run = async (p: PromiseLike<{ error: { message: string } | null }>, ok: string) => {
    setMsg(null);
    const { error } = await p;
    if (error) setMsg({ tone: "error", text: friendly(error.message) });
    else setMsg({ tone: "ok", text: ok });
    qc.invalidateQueries({ queryKey: ["staff"] });
    return !error;
  };
  const me = (user.email ?? "").toLowerCase();

  return (
    <div>
      <PageTitle title="Configurações" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">Gerenciar usuários</h2>
        {!adding && <button className={primaryBtn} onClick={() => { setAdding(true); setMsg(null); }}><Plus className="size-4" /> Adicionar usuário</button>}
      </div>

      {adding && <AddUser onDone={(text) => { setAdding(false); if (text) setMsg({ tone: "ok", text }); qc.invalidateQueries({ queryKey: ["staff"] }); }} />}
      {msg && <div className="mb-4"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full min-w-[760px] font-sans text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              <th className="px-4 py-3">Nome</th><th className="px-4 py-3">E-mail</th><th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Status</th><th className="px-4 py-3">Último acesso</th><th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((s) => (
              <tr key={s.email} className="align-middle">
                <td className="px-4 py-3">{s.name ?? "—"}{s.email === me && <span className="ml-2 text-xs text-muted-foreground">(você)</span>}</td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">
                  <select aria-label={`Perfil de ${s.email}`} value={s.role} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                    onChange={(e) => run(supabase.from("staff_members").update({ role: e.target.value as StaffRole }).eq("email", s.email), `Perfil alterado para ${roleLabel(e.target.value as StaffRole)}.`)}>
                    <option value="editor">Editor</option><option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[0.65rem] font-bold uppercase tracking-[0.12em] ${s.active ? "text-primary" : "text-muted-foreground"}`}>{s.active ? "Ativo" : "Inativo"}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{fmt(s.last_sign_in_at)}</td>
                <td className="px-4 py-3">
                  {confirmEmail === s.email ? (
                    <div className="space-y-2">
                      <p className="text-xs">Tem certeza de que deseja remover o acesso deste usuário?</p>
                      <div className="flex gap-2">
                        <button className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground" onClick={() => setConfirmEmail(null)}>Cancelar</button>
                        <button className="text-xs font-bold uppercase tracking-[0.12em] text-destructive"
                          onClick={async () => { await run(supabase.from("staff_members").delete().eq("email", s.email), "Acesso removido."); setConfirmEmail(null); }}>Remover acesso</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.12em]">
                      <button className="text-foreground hover:text-accent"
                        onClick={() => run(supabase.from("staff_members").update({ active: !s.active }).eq("email", s.email), s.active ? "Acesso desativado." : "Acesso ativado.")}>
                        {s.active ? "Desativar" : "Ativar"}
                      </button>
                      <button className="text-destructive" onClick={() => setConfirmEmail(s.email)}>Remover</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-2xl font-sans text-xs leading-5 text-muted-foreground">
        Depois de adicionado, o usuário define a própria senha em “Esqueci minha senha”, na tela de login.
      </p>
    </div>
  );
}

function AddUser({ onDone }: { onDone: (msg?: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("editor");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const clean = email.trim().toLowerCase();
    const { error } = await supabase.from("staff_members").insert({ name: name.trim(), email: clean, role });
    if (error) { setBusy(false); return setError(friendly(error.message)); }
    // Send the first-access link so the person sets their own password.
    await supabase.auth.signInWithOtp({
      email: clean,
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/admin/nova-senha` },
    });
    setBusy(false);
    onDone(`Usuário criado. Enviamos para ${clean} um link para definir a senha.`);
  };

  return (
    <form onSubmit={submit} className="mb-6 grid gap-4 border border-border bg-background p-5 sm:grid-cols-3">
      <div><label htmlFor="nu-name" className={labelClass}>Nome</label><input id="nu-name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></div>
      <div><label htmlFor="nu-email" className={labelClass}>E-mail</label><input id="nu-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></div>
      <div>
        <label htmlFor="nu-role" className={labelClass}>Perfil</label>
        <select id="nu-role" value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className={inputClass}>
          <option value="editor">Editor</option><option value="admin">Administrador</option>
        </select>
      </div>
      {error && <div className="sm:col-span-3"><Notice tone="error">{error}</Notice></div>}
      <div className="flex gap-3 sm:col-span-3">
        <button type="submit" disabled={busy} className={primaryBtn}>{busy ? "Criando…" : "Criar usuário"}</button>
        <button type="button" className={ghostBtn} onClick={() => onDone()}>Cancelar</button>
      </div>
    </form>
  );
}

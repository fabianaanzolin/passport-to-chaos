import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Notice, PageTitle, adminMeta, ghostBtn, inputClass, primaryBtn, useAdmin } from "@/components/admin/admin-ui";
import { Field, ImageField, SaveBar, TextInput, useContentForm } from "@/components/admin/content-form";
import { imageFor, saveContent, useSiteContent } from "@/lib/site-content";
import { isBuiltIn, quadroSlug, refreshQuadros, useCustomQuadros, type QuadroRow } from "@/lib/quadros-db";

export const Route = createFileRoute("/admin/quadros")({
  head: () => ({ meta: adminMeta("Quadros") }),
  component: QuadrosAdmin,
});

const HAS_EPISODES = "Este quadro possui episódios associados. Para excluí-lo, primeiro transfira os episódios para outro quadro.";
type Editing = null | "new" | string;

function useEpisodeCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const reload = async () => {
    const { data } = await supabase.from("episodes").select("quadro");
    const c: Record<string, number> = {};
    for (const r of data ?? []) c[r.quadro] = (c[r.quadro] ?? 0) + 1;
    setCounts(c);
  };
  useEffect(() => { reload(); }, []);
  return { counts, reload };
}

function QuadrosAdmin() {
  const { role } = useAdmin();
  const site = useSiteContent();
  const { list } = useCustomQuadros();
  const { counts, reload } = useEpisodeCounts();
  const [editing, setEditing] = useState<Editing>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  useEffect(() => { refreshQuadros(); }, []);

  const rows = [
    ...(["vida-a-bordo", "turbulencia"] as const).map((slug) => {
      const q = site[`quadro:${slug}`];
      return { slug, name: q.name, image: imageFor(site, `quadro:${slug}`, q.image), active: q.status !== "inactive", builtIn: true };
    }),
    ...list.map((q) => ({ slug: q.slug, name: q.name, image: q.imageUrl, active: q.status === "active", builtIn: false })),
  ];

  const toggle = async (slug: string, active: boolean) => {
    setMsg(null);
    const status = active ? "inactive" : "active";
    const error = isBuiltIn(slug)
      ? await saveContent(`quadro:${slug as "vida-a-bordo" | "turbulencia"}`, { ...site[`quadro:${slug as "vida-a-bordo"}`], status })
      : (await supabase.from("quadros").update({ status }).eq("slug", slug)).error;
    if (error) return setMsg({ tone: "error", text: "Não foi possível alterar o status. Tente novamente." });
    await refreshQuadros();
    setMsg({ tone: "ok", text: status === "active" ? "Quadro ativado. Já aparece no site." : "Quadro desativado. Saiu do site; os episódios continuam vinculados." });
  };

  const remove = async (slug: string, name: string) => {
    setMsg(null);
    const { count } = await supabase.from("episodes").select("id", { count: "exact", head: true }).eq("quadro", slug);
    if (count) return setMsg({ tone: "error", text: HAS_EPISODES });
    if (!window.confirm(`Excluir o quadro “${name}”? Esta ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from("quadros").delete().eq("slug", slug);
    if (error) return setMsg({ tone: "error", text: /associados/.test(error.message) ? HAS_EPISODES : "Não foi possível excluir. Tente novamente." });
    await Promise.all([refreshQuadros(), reload()]);
    if (editing === slug) setEditing(null);
    setMsg({ tone: "ok", text: "Quadro excluído." });
  };

  return (
    <div>
      <PageTitle title="Quadros">
        <button type="button" onClick={() => { setMsg(null); setEditing("new"); }} className={primaryBtn}>
          <Plus className="mr-1 inline size-4" /> Novo Quadro
        </button>
      </PageTitle>

      {msg && <div className="mb-6"><Notice tone={msg.tone}>{msg.text}</Notice></div>}

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full min-w-[720px] font-sans text-sm">
          <thead className="border-b border-border text-left text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Arte</th><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Episódios</th>
              <th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  {r.image ? <img src={r.image} alt="" className="size-12 rounded-full object-cover" /> : <span className="block size-12 rounded-full bg-secondary" />}
                </td>
                <td className="px-4 py-3 font-semibold">{r.name}<span className="block text-xs font-normal text-muted-foreground">/quadros/{r.slug}</span></td>
                <td className="px-4 py-3">{counts[r.slug] ?? 0}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] ${r.active ? "border-accent text-accent" : "border-border text-muted-foreground"}`}>
                    {r.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-3 text-xs font-bold uppercase tracking-[0.12em]">
                    <button type="button" onClick={() => { setMsg(null); setEditing(r.slug); }} className="hover:text-accent">Editar</button>
                    <a href={`/quadros/${r.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
                      Visualizar <ExternalLink className="size-3" />
                    </a>
                    <button type="button" onClick={() => toggle(r.slug, r.active)} className="hover:text-accent">{r.active ? "Desativar" : "Ativar"}</button>
                    {!r.builtIn && role === "admin" && (
                      <button type="button" onClick={() => remove(r.slug, r.name)} className="text-accent hover:underline">Excluir</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-sans text-xs text-muted-foreground">
        Quadros inativos saem do site e da lista de novos episódios, mas os episódios já vinculados continuam no lugar.
        {role !== "admin" && " A exclusão de quadros é feita pelo Administrador."}
      </p>

      {editing && (
        <div className="mt-10 max-w-3xl">
          {editing === "vida-a-bordo" || editing === "turbulencia" ? (
            <BuiltInForm key={editing} slug={editing} onClose={() => setEditing(null)} />
          ) : (
            <CustomForm
              key={editing}
              quadro={editing === "new" ? undefined : list.find((q) => q.slug === editing)}
              onClose={() => setEditing(null)}
              onSaved={(text) => { setEditing(null); setMsg({ tone: "ok", text }); }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function BuiltInForm({ slug, onClose }: { slug: "vida-a-bordo" | "turbulencia"; onClose: () => void }) {
  const f = useContentForm(`quadro:${slug}`, (v) => (v.name.trim() ? null : "Informe o nome do quadro."));
  const v = f.value;
  return (
    <form onSubmit={f.submit} className="space-y-5 border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-semibold">Editar {v.name || slug}</p>
        <button type="button" onClick={onClose} className={ghostBtn}>Fechar</button>
      </div>
      <TextInput id={`${slug}-name`} label="Nome" value={v.name} onChange={(name) => f.set({ name })} />
      <TextInput id={`${slug}-phrase`} label="Frase" value={v.phrase} onChange={(phrase) => f.set({ phrase })} />
      <TextInput id={`${slug}-desc`} label="Descrição" value={v.description} onChange={(description) => f.set({ description })} multiline />
      <ImageField id={`quadro-${slug}`} label="Arte" value={v.image} onChange={(image) => f.set({ image })} round />
      <Field id={`${slug}-status`} label="Status">
        <select id={`${slug}-status`} value={v.status} onChange={(e) => f.set({ status: e.target.value })} className={inputClass}>
          <option value="active">Ativo — aparece na página Quadros</option>
          <option value="inactive">Inativo — fica oculto na página Quadros</option>
        </select>
      </Field>
      <SaveBar busy={f.busy} msg={f.msg} />
    </form>
  );
}

function CustomForm({ quadro, onClose, onSaved }: { quadro?: QuadroRow; onClose: () => void; onSaved: (msg: string) => void }) {
  const [v, setV] = useState({
    name: quadro?.name ?? "", short_description: quadro?.short_description ?? "", description: quadro?.description ?? "",
    phrase: quadro?.phrase ?? "", image: quadro?.image ?? "", status: quadro?.status ?? "active",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (patch: Partial<typeof v>) => { setError(""); setV((x) => ({ ...x, ...patch })); };
  const slug = quadro?.slug ?? quadroSlug(v.name);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!v.name.trim()) return setError("Informe o nome do quadro.");
    if (!slug) return setError("Use letras ou números no nome do quadro.");
    if (!quadro && isBuiltIn(slug)) return setError("Já existe um quadro com esse endereço. Escolha outro nome.");
    setBusy(true);
    const payload = { ...v, name: v.name.trim(), short_description: v.short_description.trim(), description: v.description.trim(), phrase: v.phrase.trim() };
    const { error: err } = quadro
      ? await supabase.from("quadros").update(payload).eq("slug", quadro.slug)
      : await supabase.from("quadros").insert({ ...payload, slug });
    setBusy(false);
    if (err) return setError(err.code === "23505" ? "Já existe um quadro com esse endereço. Escolha outro nome." : "Não foi possível salvar. Confira os campos e tente novamente.");
    await refreshQuadros();
    onSaved(quadro ? "Quadro atualizado." : v.status === "active" ? "Quadro criado. Já aparece no site e na lista de episódios." : "Quadro criado como inativo.");
  };

  return (
    <form onSubmit={submit} className="space-y-5 border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-semibold">{quadro ? `Editar ${quadro.name}` : "Novo Quadro"}</p>
        <button type="button" onClick={onClose} className={ghostBtn}>Fechar</button>
      </div>
      <Field id="q-name" label="Nome do quadro *">
        <input id="q-name" required value={v.name} onChange={(e) => set({ name: e.target.value })} className={inputClass} />
        <p className="mt-1.5 font-sans text-xs text-muted-foreground">
          Endereço: /quadros/{slug || "…"}{quadro && " (fixo, para não quebrar links já compartilhados)"}
        </p>
      </Field>
      <TextInput id="q-short" label="Descrição curta" value={v.short_description} onChange={(short_description) => set({ short_description })} />
      <TextInput id="q-desc" label="Descrição completa" value={v.description} onChange={(description) => set({ description })} multiline />
      <TextInput id="q-phrase" label="Frase de destaque" value={v.phrase} onChange={(phrase) => set({ phrase })} />
      <ImageField id={`quadro-${slug || "novo"}`} label="Imagem ou arte oficial" value={v.image} onChange={(image) => set({ image })} round />
      <Field id="q-status" label="Status">
        <select id="q-status" value={v.status} onChange={(e) => set({ status: e.target.value })} className={inputClass}>
          <option value="active">Ativo — aparece no site e nos episódios</option>
          <option value="inactive">Inativo — fica oculto</option>
        </select>
      </Field>
      {error && <Notice tone="error">{error}</Notice>}
      <button type="submit" disabled={busy} className={primaryBtn}>{busy ? "Salvando…" : quadro ? "Salvar alterações" : "Criar quadro"}</button>
    </form>
  );
}

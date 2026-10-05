import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatEpisodeDate, resolveCover, type EpisodeRow } from "@/lib/episodes-db";
import { quadros, type QuadroSlug } from "@/lib/content";
import { Notice, PageTitle, adminMeta, primaryBtn } from "@/components/admin/admin-ui";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/episodios/")({
  validateSearch: (s: Record<string, unknown>) => ({ salvo: s.salvo ? 1 : undefined }),
  head: () => ({ meta: adminMeta("Episódios") }),
  component: EpisodesAdmin,
});

export const adminEpisodesQuery = {
  queryKey: ["admin-episodes"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("episodes").select("*")
      .order("published_on", { ascending: false, nullsFirst: true })
      .order("number", { ascending: false });
    if (error) throw error;
    return data;
  },
};

function EpisodesAdmin() {
  const { salvo } = Route.useSearch();
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery(adminEpisodesQuery);
  const [toDelete, setToDelete] = useState<EpisodeRow | null>(null);
  const [msg, setMsg] = useState(salvo ? "Episódio salvo com sucesso." : "");
  const [err, setErr] = useState("");

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-episodes"] });

  const update = async (ep: EpisodeRow, patch: Partial<EpisodeRow>, done: string) => {
    setErr("");
    const { error } = await supabase.from("episodes").update(patch).eq("id", ep.id);
    if (error) return setErr("Não foi possível concluir a ação. Tente novamente.");
    setMsg(done);
    refresh();
  };

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("episodes").delete().eq("id", toDelete.id);
    if (error) setErr("Não foi possível excluir. Tente novamente.");
    else setMsg(`Episódio "${toDelete.title}" excluído.`);
    setToDelete(null);
    refresh();
  };

  return (
    <div>
      <PageTitle title="Episódios">
        <Link to="/admin/episodios/novo" className={primaryBtn}><Plus className="size-4" /> Novo episódio</Link>
      </PageTitle>
      <div className="mb-5 space-y-2">
        {msg && <Notice>{msg}</Notice>}
        {err && <Notice tone="error">{err}</Notice>}
      </div>

      {isLoading ? (
        <p className="font-sans text-sm text-muted-foreground">Carregando…</p>
      ) : data.length === 0 ? (
        <p className="font-sans text-sm text-muted-foreground">Nenhum episódio cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto border border-border bg-background">
          <table className="w-full min-w-[820px] font-sans text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                {["Capa", "Nº", "Título", "Quadro", "Data", "Status", "Destaque", "Ações"].map((h) => (
                  <th key={h} className="px-4 py-3 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((ep) => (
                <tr key={ep.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3"><Cover value={ep.cover_url} /></td>
                  <td className="px-4 py-3 font-bold">#{ep.number}</td>
                  <td className="px-4 py-3 font-display text-lg font-semibold">{ep.title}</td>
                  <td className="px-4 py-3">{quadros[ep.quadro as QuadroSlug]?.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatEpisodeDate(ep.published_on) || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={ep.status} /></td>
                  <td className="px-4 py-3">
                    <button type="button" title={ep.featured ? "Em destaque na Home" : "Destacar na Home"}
                      aria-label={ep.featured ? "Em destaque na Home" : "Destacar na Home"}
                      onClick={() => !ep.featured && update(ep, { featured: true }, `"${ep.title}" agora é o destaque da Home.`)}
                      className={ep.featured ? "text-stamp" : "text-muted-foreground/50 hover:text-stamp"}>
                      <Star className="size-5" fill={ep.featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 whitespace-nowrap text-xs font-bold uppercase tracking-[0.1em]">
                      <Link to="/admin/episodios/editar" search={{ id: ep.id }} className="inline-flex items-center gap-1 hover:text-accent"><Pencil className="size-3.5" /> Editar</Link>
                      <a href={`/episodios/${ep.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent"><Eye className="size-3.5" /> Ver</a>
                      <button type="button" className="hover:text-accent"
                        onClick={() => update(ep, { status: ep.status === "published" ? "draft" : "published" },
                          ep.status === "published" ? `"${ep.title}" saiu do site.` : `"${ep.title}" foi publicado.`)}>
                        {ep.status === "published" ? "Despublicar" : "Publicar"}
                      </button>
                      <button type="button" onClick={() => setToDelete(ep)} className="inline-flex items-center gap-1 text-destructive hover:opacity-80"><Trash2 className="size-3.5" /> Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir "{toDelete?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              O episódio será apagado de vez e sairá do site. Para apenas tirá-lo do ar, use "Despublicar".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const pub = status === "published";
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] ${pub ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
      {pub ? "Publicado" : "Rascunho"}
    </span>
  );
}

function Cover({ value }: { value: string | null }) {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    resolveCover(value).then(setSrc);
  }, [value]);
  return (
    <div className="flex h-14 w-11 items-center justify-center bg-secondary">
      {src && <img src={src} alt="" className="max-h-full max-w-full object-contain" />}
    </div>
  );
}

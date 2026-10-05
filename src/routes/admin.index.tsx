import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { quadros, type QuadroSlug } from "@/lib/content";
import { adminMeta, primaryBtn, useAdmin } from "@/components/admin/admin-ui";
import { adminEpisodesQuery, StatusBadge } from "@/components/admin/episodes-admin";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: adminMeta("Dashboard") }),
  component: Dashboard,
});

function Dashboard() {
  const { role } = useAdmin();
  const { data = [] } = useQuery(adminEpisodesQuery);
  const published = data.filter((e) => e.status === "published");
  const drafts = data.length - published.length;
  const latest = published[0];

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-muted-foreground">Dashboard</p>
          <h1 className="mt-2 font-display text-5xl font-semibold">Olá, {role === "editor" ? "Adriele" : "equipe"}.</h1>
        </div>
        <Link to="/admin/episodios/novo" className={primaryBtn}><Plus className="size-4" /> Novo episódio</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Episódios publicados" value={String(published.length)} />
        <Stat label="Rascunhos" value={String(drafts)} />
        <Stat label="Quadros ativos" value={String(Object.keys(quadros).length)} />
        <Stat label="Último episódio" value={latest ? latest.title : "—"} small />
      </div>

      <section className="mt-12">
        <h2 className="mb-4 font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">Episódios recentes</h2>
        <ul className="divide-y divide-border border border-border bg-background font-sans text-sm">
          {data.slice(0, 5).map((ep) => (
            <li key={ep.id} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4">
              <span className="w-12 font-bold">#{ep.number}</span>
              <span className="flex-1 font-display text-lg font-semibold">{ep.title}</span>
              <span className="text-muted-foreground">{quadros[ep.quadro as QuadroSlug]?.name}</span>
              <StatusBadge status={ep.status} />
              <Link to="/admin/episodios/editar" search={{ id: ep.id }} className="text-xs font-bold uppercase tracking-[0.12em] text-accent hover:underline">Editar</Link>
            </li>
          ))}
          {data.length === 0 && <li className="px-5 py-4 text-muted-foreground">Nenhum episódio ainda.</li>}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="border border-border bg-background p-5">
      <p className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={`mt-3 font-display font-semibold ${small ? "text-2xl leading-tight" : "text-5xl"}`}>{value}</p>
    </div>
  );
}

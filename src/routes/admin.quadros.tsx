import { createFileRoute } from "@tanstack/react-router";
import { quadros } from "@/lib/content";
import { PageTitle, adminMeta } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin/quadros")({
  head: () => ({ meta: adminMeta("Quadros") }),
  component: () => (
    <div>
      <PageTitle title="Quadros" />
      <div className="grid gap-5 sm:grid-cols-2">
        {Object.values(quadros).map((q) => (
          <div key={q.slug} className="flex gap-5 border border-border bg-background p-5">
            <img src={q.image} alt={`Arte do quadro ${q.name}`} className="h-28 w-28 shrink-0 object-contain" />
            <div className="font-sans text-sm">
              <p className="font-display text-2xl font-semibold">{q.name}</p>
              <span className="mt-2 inline-block rounded-full bg-primary px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-primary-foreground">Ativo</span>
              <p className="mt-3 text-muted-foreground">{q.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">Edição de descrição e arte: em breve.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});

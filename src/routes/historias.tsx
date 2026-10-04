import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, PageShell, StoryInvite } from "@/components/site/SiteChrome";
import { storyCategories } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/historias")({
  head: () => ({
    meta: pageMeta(
      "Histórias | Passaporte para o Caos",
      "O arquivo de histórias do Passaporte para o Caos: avião, navio, hotel, bastidores, perrengues e histórias absurdas.",
    ),
  }),
  component: HistoriasPage,
});

function HistoriasPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Arquivo" title="Histórias">
        <p>
          Aqui vai morar o arquivo de histórias do Passaporte para o Caos — organizadas por tipo de
          caos. As primeiras chegam em breve.
        </p>
      </PageIntro>

      <section className="mx-auto max-w-[1312px] px-6 pb-20 sm:px-10">
        <ul className="grid grid-cols-1 border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {storyCategories.map((cat, i) => (
            <li key={cat} className="flex min-h-[150px] flex-col justify-between border-b border-r border-border p-6 sm:min-h-[180px] sm:p-8">
              <span className="font-sans text-[0.62rem] font-bold tracking-[0.2em] text-stamp">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-3xl font-semibold leading-none sm:text-4xl">{cat}</h2>
                <span className="shrink-0 font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Em breve
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <StoryInvite title="A próxima pode ser a sua." />
    </PageShell>
  );
}

import { usePublishedEpisodes } from "@/lib/episodes-db";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { type QuadroSlug } from "@/lib/content";
import { paragraphs, useQuadro } from "@/lib/site-content";
import { useCustomQuadros } from "@/lib/quadros-db";
import { Eyebrow, PageShell, StoryInvite } from "./SiteChrome";
import { EpisodeCard, episodeGridClass } from "./EpisodeCard";

export function QuadroPage({ slug }: { slug: QuadroSlug }) {
  const q = useQuadro(slug);
  const turb = slug === "turbulencia";
  const { episodes } = usePublishedEpisodes();
  const list = episodes.filter((e) => e.quadro === slug);

  return (
    <PageShell>
      <section className={turb ? "bg-primary text-primary-foreground" : "bg-secondary"}>
        <div className="mx-auto grid max-w-[1312px] items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_auto] lg:py-24">
          <div>
          <Link to="/quadros" className={`inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.16em] ${turb ? "text-primary-foreground/70" : "text-muted-foreground"} hover:text-accent`}>
            <ArrowLeft className="size-4" /> Quadros
          </Link>
          <Eyebrow className={`mt-10 ${turb ? "text-primary-foreground/70" : ""}`}>{q.kicker}</Eyebrow>
          <h1 className={`font-display text-[clamp(3.2rem,10vw,8rem)] leading-[0.85] font-semibold ${turb ? "-skew-x-6" : ""}`}>
            {q.name}
            {turb && <span className="text-accent">.</span>}
          </h1>
          <p className={`mt-8 max-w-xl font-display text-2xl italic leading-snug sm:text-3xl ${turb ? "" : "text-foreground"}`}>
            {q.description}
          </p>
          <ul className="mt-10 flex max-w-3xl flex-wrap gap-2">
            {q.topics.map((t) => (
              <li key={t} className={`border px-3 py-1.5 font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] ${turb ? "border-primary-foreground/30" : "border-border bg-background"}`}>
                {t}
              </li>
            ))}
          </ul>
          </div>
          <img src={q.image} alt={`Selo do quadro ${q.name}`} className="mx-auto w-56 rounded-full sm:w-72 lg:w-96" />
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-6 py-16 sm:px-10 lg:py-20">
        <h2 className="mb-8 border-b border-border pb-4 font-display text-3xl font-semibold">Episódios do quadro</h2>
        {list.length > 0 ? (
          <div className={episodeGridClass}>
            {list.map((ep) => (
              <EpisodeCard key={ep.slug} episode={ep} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-muted-foreground">Os primeiros episódios deste quadro chegam em breve.</p>
        )}
      </section>

      <StoryInvite />
    </PageShell>
  );
}

/** Page for a Quadro created in the admin — same editorial pattern as the built-in ones. */
export function CustomQuadroPage({ slug }: { slug: string }) {
  const { list, loaded } = useCustomQuadros();
  const { episodes } = usePublishedEpisodes();
  const q = list.find((x) => x.slug === slug && x.status === "active");
  if (!q) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-semibold">{loaded ? "Quadro não encontrado" : "Carregando quadro…"}</h1>
          {loaded && (
            <Link to="/quadros" className="mt-6 inline-block font-sans text-sm font-bold text-accent underline underline-offset-4">
              Ver todos os quadros
            </Link>
          )}
        </div>
      </PageShell>
    );
  }
  const list2 = episodes.filter((e) => e.quadro === slug);
  return (
    <PageShell>
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-[1312px] items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_auto] lg:py-24">
          <div>
            <Link to="/quadros" className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-accent">
              <ArrowLeft className="size-4" /> Quadros
            </Link>
            <Eyebrow className="mt-10">Quadro</Eyebrow>
            <h1 className="font-display text-[clamp(3.2rem,10vw,8rem)] leading-[0.85] font-semibold">{q.name}</h1>
            {q.phrase && <p className="mt-8 max-w-xl font-display text-2xl italic leading-snug text-foreground sm:text-3xl">{q.phrase}</p>}
            {q.short_description && <p className="mt-6 max-w-xl font-sans text-base leading-7 sm:text-lg">{q.short_description}</p>}
            {paragraphs(q.description).map((p, i) => (
              <p key={i} className="mt-4 max-w-2xl font-sans text-sm leading-7 text-muted-foreground sm:text-base">{p}</p>
            ))}
          </div>
          {q.imageUrl && <img src={q.imageUrl} alt={`Arte oficial do quadro ${q.name}`} className="mx-auto w-56 rounded-full sm:w-72 lg:w-96" />}
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-6 py-16 sm:px-10 lg:py-20">
        <h2 className="mb-8 border-b border-border pb-4 font-display text-3xl font-semibold">Episódios do quadro</h2>
        {list2.length > 0 ? (
          <div className={episodeGridClass}>
            {list2.map((ep) => <EpisodeCard key={ep.slug} episode={ep} />)}
          </div>
        ) : (
          <p className="font-sans text-muted-foreground">Os primeiros episódios deste quadro chegam em breve.</p>
        )}
      </section>

      <StoryInvite />
    </PageShell>
  );
}

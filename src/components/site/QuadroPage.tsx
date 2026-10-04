import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { episodes, quadros, type QuadroSlug } from "@/lib/content";
import { Eyebrow, PageShell, StoryInvite } from "./SiteChrome";
import { EpisodeCard, episodeGridClass } from "./EpisodeCard";

export function QuadroPage({ slug }: { slug: QuadroSlug }) {
  const q = quadros[slug];
  const turb = slug === "turbulencia";
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

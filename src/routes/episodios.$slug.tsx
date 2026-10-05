import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Share2, Youtube } from "lucide-react";
import { Eyebrow, PageShell, SpotifyIcon, StoryInvite } from "@/components/site/SiteChrome";
import { EpisodeCard, EpisodeCover, episodeGridClass } from "@/components/site/EpisodeCard";
import { episodes as staticEpisodes, quadros } from "@/lib/content";
import { usePublishedEpisodes } from "@/lib/episodes-db";

export const Route = createFileRoute("/episodios/$slug")({
  loader: ({ params }) => {
    // Built-in episodes render immediately; episodes created in the admin load in the browser.
    const episode = staticEpisodes.find((e) => e.slug === params.slug) ?? null;
    return { episode, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const ep = loaderData?.episode;
    const title = ep ? `Ep. ${ep.number}: ${ep.title} | Passaporte para o Caos` : "Episódio | Passaporte para o Caos";
    const description = ep?.description ?? "Episódio do podcast Passaporte para o Caos.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-semibold">Episódio não encontrado</h1>
        <Link to="/episodios" className="mt-6 inline-block font-sans text-sm font-bold text-accent underline underline-offset-4">
          Ver todos os episódios
        </Link>
      </div>
    </PageShell>
  ),
  component: EpisodePage,
});

function EpisodePage() {
  const { episode: initial, slug } = Route.useLoaderData();
  const { episodes, loaded } = usePublishedEpisodes();
  const [copied, setCopied] = useState(false);
  const live = episodes.find((e) => e.slug === slug);
  const episode = loaded ? live : (live ?? initial);
  if (!episode) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-semibold">{loaded ? "Episódio não encontrado" : "Carregando episódio…"}</h1>
          {loaded && (
            <Link to="/episodios" className="mt-6 inline-block font-sans text-sm font-bold text-accent underline underline-offset-4">
              Ver todos os episódios
            </Link>
          )}
        </div>
      </PageShell>
    );
  }
  const related = episodes.filter((e) => e.slug !== episode.slug).slice(0, 3);
  const quadro = quadros[episode.quadro];

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: episode.title, url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <PageShell>
      <article className="mx-auto max-w-[1312px] px-6 pb-20 pt-10 sm:px-10 lg:pt-14">
        <Link to="/episodios" className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-accent">
          <ArrowLeft className="size-4" /> Episódios
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="mx-auto w-full max-w-[380px] lg:mx-0">
            <EpisodeCover episode={episode} large />
          </div>

          <div>
            <Eyebrow>
              Episódio {episode.number} · {episode.date}
            </Eyebrow>
            <h1 className="font-display text-[clamp(2.4rem,5.5vw,4.4rem)] leading-[0.95] font-semibold text-balance">
              {episode.title}
            </h1>
            {episode.description && (
              <p className="mt-6 max-w-xl font-sans text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {episode.description}
              </p>
            )}
            {episode.longDescription && (
              <p className="mt-4 max-w-xl whitespace-pre-line font-sans text-base leading-7 text-muted-foreground">
                {episode.longDescription}
              </p>
            )}


            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-6 border-y border-border py-5 font-sans text-sm">
              <div>
                <dt className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Quadro</dt>
                <dd className="mt-1">
                  <Link to={quadro.slug === "turbulencia" ? "/quadros/turbulencia" : "/quadros/vida-a-bordo"} className="font-semibold text-stamp hover:text-accent">
                    {quadro.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Categorias</dt>
                <dd className="mt-1 font-semibold">{episode.categories.length ? episode.categories.join(" · ") : quadro.name}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={episode.spotifyUrl} target="_blank" rel="noreferrer" aria-label="Ouvir este episódio no Spotify"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-7 font-sans text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
                <SpotifyIcon className="size-5" /> Ouvir no Spotify
              </a>
              {episode.youtubeUrl && (
                <a href={episode.youtubeUrl} target="_blank" rel="noreferrer" aria-label="Assistir este episódio no YouTube"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-6 font-sans text-sm font-bold hover:text-accent">
                  <Youtube className="size-4" strokeWidth={1.7} /> YouTube
                </a>
              )}
              <button type="button" onClick={share}
                className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-sans text-sm font-bold text-muted-foreground hover:text-foreground">
                <Share2 className="size-4" strokeWidth={1.7} /> {copied ? "Link copiado" : "Compartilhar"}
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 border-b border-border pb-4 font-display text-3xl font-semibold">Episódios relacionados</h2>
            <div className={episodeGridClass}>
              {related.map((ep) => (
                <EpisodeCard key={ep.slug} episode={ep} />
              ))}
            </div>
          </section>
        )}
      </article>

      <StoryInvite title="Você tem uma história?" />
    </PageShell>
  );
}

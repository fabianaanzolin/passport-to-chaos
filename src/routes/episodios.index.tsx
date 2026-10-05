import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, PageShell, SpotifyIcon, StoryInvite } from "@/components/site/SiteChrome";
import { EpisodeCard, episodeGridClass } from "@/components/site/EpisodeCard";
import { usePublishedEpisodes } from "@/lib/episodes-db";
import { pageMeta, spotifyUrl } from "@/lib/site";

export const Route = createFileRoute("/episodios/")({
  head: () => ({
    meta: pageMeta(
      "Episódios | Passaporte para o Caos",
      "Ouça os episódios do podcast Passaporte para o Caos: histórias reais de viagens que não saíram como planejado.",
    ),
  }),
  component: EpisodesPage,
});

function EpisodesPage() {
  const { episodes } = usePublishedEpisodes();
  return (
    <PageShell>
      <PageIntro eyebrow="Podcast · Episódios" title="Passaporte para o Caos">
        <p className="font-display text-2xl italic leading-snug text-foreground sm:text-3xl">
          Histórias que talvez nunca devessem ter acontecido.
          <br />
          Mas aconteceram.
          <br />
          <span className="text-accent">E agora você vai ouvir.</span>
        </p>
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Ouça Passaporte para o Caos no Spotify"
          className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-7 font-sans text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <SpotifyIcon className="size-5" />
          Ouça no Spotify
        </a>
      </PageIntro>

      <section className="mx-auto -mt-4 max-w-[1312px] px-6 pb-20 sm:px-10 lg:-mt-6">
        <div className="mb-8 flex items-baseline gap-4 border-b border-border pb-4">
          <h2 className="font-display text-3xl font-semibold">Todos os episódios</h2>
          <span aria-hidden="true" className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.22em] text-stamp">Mais recente primeiro</span>
        </div>
        <div className={episodeGridClass}>
          {episodes.map((ep) => (
            <EpisodeCard key={ep.slug} episode={ep} />
          ))}
        </div>
      </section>

      <StoryInvite />
    </PageShell>
  );
}

import { Link } from "@tanstack/react-router";
import { Youtube } from "lucide-react";
import { quadros, type Episode } from "@/lib/content";
import { SpotifyIcon } from "./SiteChrome";

export function EpisodeCover({ episode, large = false }: { episode: Episode; large?: boolean }) {
  if (episode.cover) {
    return <img src={episode.cover} alt={`Capa do episódio ${episode.number}`} className="aspect-square w-full object-cover" />;
  }
  const turb = episode.quadro === "turbulencia";
  return (
    <div
      className={`relative flex aspect-square w-full flex-col justify-between overflow-hidden p-5 ${turb ? "bg-accent" : "bg-primary"} text-primary-foreground`}
      aria-hidden="true"
    >
      <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.24em] opacity-80">
        {quadros[episode.quadro].name}
      </span>
      <span className={`font-display font-semibold leading-none ${large ? "text-[9rem]" : "text-[5.5rem]"}`}>
        {episode.number}
      </span>
      <span className="absolute right-4 top-4 rotate-[8deg] border border-primary-foreground/60 px-2 py-1 font-sans text-[0.5rem] font-bold uppercase tracking-[0.16em]">
        Passaporte
      </span>
    </div>
  );
}

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="flex flex-col border border-border bg-background">
      <Link to="/episodios/$slug" params={{ slug: episode.slug }} aria-label={`Ver episódio ${episode.number}`}>
        <EpisodeCover episode={episode} />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <span>Ep. {episode.number}</span>
          <span className="text-stamp">{quadros[episode.quadro].name}</span>
          {episode.demo && <span className="text-accent">Demonstração</span>}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-tight font-semibold">
          <Link to="/episodios/$slug" params={{ slug: episode.slug }} className="hover:text-accent">
            {episode.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 font-sans text-sm leading-6 text-muted-foreground">{episode.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={episode.spotifyUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Ouvir episódio ${episode.number} no Spotify`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 font-sans text-xs font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <SpotifyIcon className="size-4" />
            Ouvir episódio
          </a>
          {episode.youtubeUrl && (
            <a
              href={episode.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Assistir episódio ${episode.number} no YouTube`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 font-sans text-xs font-bold text-foreground hover:text-accent"
            >
              <Youtube className="size-4" strokeWidth={1.7} />
              YouTube
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

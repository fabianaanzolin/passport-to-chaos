import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { quadros, type Episode } from "@/lib/content";
import { SpotifyIcon } from "./SiteChrome";

export function EpisodeCover({ episode, large = false }: { episode: Episode; large?: boolean }) {
  if (episode.cover) {
    // Contained, never cropped: keeps the full official art (including titles) visible.
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-secondary p-3">
        <img
          src={episode.cover}
          alt={`Capa do episódio ${episode.number}: ${episode.title}`}
          className="max-h-full max-w-full object-contain shadow-[0_14px_30px_-18px_color-mix(in_oklab,var(--foreground)_55%,transparent)]"
        />
      </div>
    );
  }
  const turb = episode.quadro === "turbulencia";
  return (
    <div
      className={`relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden p-5 ${turb ? "bg-accent" : "bg-primary"} text-primary-foreground`}
      aria-hidden="true"
    >
      <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.24em] opacity-80">
        {quadros[episode.quadro].name}
      </span>
      <span className={`font-display font-semibold leading-none ${large ? "text-[9rem]" : "text-[5.5rem]"}`}>
        {episode.number}
      </span>
    </div>
  );
}

/** Responsive grid for episode cards: fixed-width columns, left-aligned, never stretched. */
export const episodeGridClass =
  "grid max-w-[360px] gap-6 sm:max-w-none sm:grid-cols-[repeat(2,minmax(0,300px))] lg:grid-cols-[repeat(3,minmax(0,300px))] lg:gap-8";

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="group flex flex-col border border-border bg-background">
      <Link to="/episodios/$slug" params={{ slug: episode.slug }} aria-label={`Ver episódio ${episode.number}: ${episode.title}`}>
        <EpisodeCover episode={episode} />
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] text-stamp">
          {quadros[episode.quadro].name} <span className="text-muted-foreground">· Ep. {episode.number}</span>
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight font-semibold">
          <Link to="/episodios/$slug" params={{ slug: episode.slug }} className="hover:text-accent">
            {episode.title}
          </Link>
        </h3>
        {episode.description && (
          <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">{episode.description}</p>
        )}
        <a
          href={episode.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Ouvir episódio ${episode.number}, ${episode.title}, no Spotify`}
          className="mt-4 inline-flex items-center gap-2 self-start border-b-2 border-accent pb-1 font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
        >
          <SpotifyIcon className="size-4" />
          Ouvir no Spotify
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { episodes as staticEpisodes, type Episode, type QuadroSlug } from "./content";
import { spotifyUrl } from "./site";

export type EpisodeRow = Tables<"episodes">;
export const COVER_BUCKET = "episode-covers";

const months = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function formatEpisodeDate(iso: string | null) {
  if (!iso) return "";
  const [, m, d] = iso.split("-").map(Number);
  return `${d} de ${months[m - 1]}`;
}

/** Stored covers are either public site paths ("/..."), full URLs, or paths inside the private bucket. */
export async function resolveCover(value: string | null): Promise<string | undefined> {
  if (!value) return undefined;
  if (value.startsWith("/") || value.startsWith("http")) return value;
  const { data } = await supabase.storage.from(COVER_BUCKET).createSignedUrl(value, 60 * 60 * 24 * 7);
  return data?.signedUrl;
}

export function slugify(number: string, title: string) {
  return `${number} ${title}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function rowToEpisode(row: EpisodeRow): Promise<Episode> {
  const known = staticEpisodes.find((e) => e.slug === row.slug);
  return {
    slug: row.slug,
    number: row.number,
    title: row.title,
    description: row.short_description ?? undefined,
    longDescription: row.description ?? undefined,
    date: formatEpisodeDate(row.published_on),
    quadro: row.quadro as QuadroSlug,
    categories: known?.categories ?? [],
    spotifyUrl: row.spotify_url || spotifyUrl,
    youtubeUrl: row.youtube_url ?? undefined,
    cover: await resolveCover(row.cover_url),
  };
}

export async function fetchPublishedEpisodes(): Promise<Episode[]> {
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("status", "published")
    .order("published_on", { ascending: false, nullsFirst: false })
    .order("number", { ascending: false });
  if (error || !data) throw error ?? new Error("no data");
  return Promise.all(data.map(rowToEpisode));
}

/**
 * Published episodes managed in the admin. Starts with the built-in list (so pages
 * render instantly and stay indexable), then swaps in the live list in the browser.
 */
export function usePublishedEpisodes() {
  const [list, setList] = useState<Episode[]>(staticEpisodes);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    fetchPublishedEpisodes()
      .then((eps) => active && setList(eps))
      .catch(() => {})
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);
  return { episodes: list, loaded };
}

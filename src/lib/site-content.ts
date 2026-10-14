import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveCover } from "./episodes-db";
import { quadros as baseQuadros, type QuadroSlug } from "./content";
import { contactEmail, facebookUrl, images, instagramUrl, spotifyUrl, youtubeUrl } from "./site";

/** Editable site texts. Defaults are the texts the site had before the admin existed. */
export const defaults = {
  hero: {
    title: "Viajar também é",
    highlight: "se perder.",
    subtitle: "Histórias reais de viagens, perrengues, encontros inesperados e tudo o que não estava no roteiro.",
  },
  sobre: {
    title: "As melhores histórias quase nunca estavam no roteiro.",
    text: [
      "O Passaporte para o Caos nasceu de uma ideia simples: as melhores histórias de uma viagem quase nunca estavam no roteiro.",
      "São aquelas situações que acontecem no aeroporto, na cabine, no navio, no hotel, no destino ou simplesmente no meio do caminho.",
      "Aqui, a gente conta histórias reais de viagens, perrengues, encontros inesperados e tudo aquilo que transforma uma viagem em uma história que você vai contar por anos.",
      "Porque viajar é conhecer lugares. Mas também é conhecer pessoas, viver situações inesperadas e, às vezes, entrar em um caos completo.",
    ].join("\n\n"),
  },
  historia: {
    title: "Tem uma história para contar?",
    text: "Você viveu uma história que parece mentira? Um perrengue inesquecível? Uma situação absurda a bordo? Um encontro que saiu completamente do roteiro? Então talvez essa história pertença ao Passaporte para o Caos.",
    extra: "Enquanto nosso espaço para envio de histórias não fica pronto, você já pode mandar a sua diretamente para a gente.",
  },
  perfil: {
    name: "Adriele",
    bio: "Eu sou a Adriele, apaixonada por viagens, histórias e pessoas.\n\nNo Passaporte para o Caos, compartilho relatos reais — meus, de convidados e da comunidade — mostrando que viajar é muito mais do que fotos bonitas. É se permitir viver o inesperado, aprender com o caos e colecionar experiências que se transformam em histórias.",
    photo: images.adriele,
  },
  links: { spotify: spotifyUrl, instagram: instagramUrl, youtube: youtubeUrl, facebook: facebookUrl, email: contactEmail },
  "quadro:vida-a-bordo": {
    name: baseQuadros["vida-a-bordo"].name,
    description: baseQuadros["vida-a-bordo"].description,
    phrase: "“O que acontece a bordo nem sempre fica a bordo.”",
    image: baseQuadros["vida-a-bordo"].image,
    status: "active",
  },
  "quadro:turbulencia": {
    name: baseQuadros.turbulencia.name,
    description: baseQuadros.turbulencia.description,
    phrase: "Histórias que começam normais. Até deixarem de ser.",
    image: baseQuadros.turbulencia.image,
    status: "active",
  },
};
export type SiteContent = typeof defaults;
export type ContentKey = keyof SiteContent;

/** Stored values plus resolved image addresses for display. */
type State = SiteContent & { images: Record<string, string> };

let state: State = { ...defaults, images: {} };
const listeners = new Set<() => void>();
let started = false;

async function load() {
  const { data } = await supabase.from("site_content").select("key,data");
  const next: State = { ...defaults, images: {} };
  for (const row of data ?? []) {
    const k = row.key as ContentKey;
    if (k in defaults) (next as Record<string, unknown>)[k] = { ...defaults[k], ...(row.data as object) };
  }
  const imgs: [string, string][] = [
    ["perfil", next.perfil.photo],
    ["quadro:vida-a-bordo", next["quadro:vida-a-bordo"].image],
    ["quadro:turbulencia", next["quadro:turbulencia"].image],
  ];
  for (const [k, v] of imgs) next.images[k] = (await resolveCover(v)) ?? "";
  state = next;
  listeners.forEach((l) => l());
}

export function refreshSiteContent() {
  return load();
}

export function useSiteContent(): State {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      if (!started && typeof window !== "undefined") {
        started = true;
        load().catch(() => {});
      }
      return () => listeners.delete(cb);
    },
    () => state,
    () => ({ ...defaults, images: {} }) as State,
  );
}

/** Image shown on the site: resolved address once loaded, otherwise the built-in one. */
export const imageFor = (s: State, key: string, fallback: string) =>
  s.images[key] || (fallback.startsWith("/") || fallback.startsWith("http") ? fallback : "");

export const paragraphs = (t: string) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export function useQuadro(slug: QuadroSlug) {
  const s = useSiteContent();
  const q = s[`quadro:${slug}`];
  return { ...baseQuadros[slug], ...q, image: imageFor(s, `quadro:${slug}`, q.image) || baseQuadros[slug].image, active: q.status !== "inactive" };
}

export function useLinks() {
  const l = useSiteContent().links;
  const mail = (subject: string) => `mailto:${l.email}?subject=${encodeURIComponent(subject)}`;
  return { ...l, mail, storyMailto: mail("Minha história para o Passaporte para o Caos") };
}

export async function saveContent<K extends ContentKey>(key: K, data: SiteContent[K]) {
  const { error } = await supabase.from("site_content").upsert({ key, data: data as never });
  if (!error) await load();
  return error;
}

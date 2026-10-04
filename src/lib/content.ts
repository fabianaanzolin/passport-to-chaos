import { spotifyUrl } from "./site";

export type QuadroSlug = "vida-a-bordo" | "turbulencia";

export const quadros: Record<
  QuadroSlug,
  {
    slug: QuadroSlug;
    name: string;
    kicker: string;
    description: string;
    topics: string[];
    cta: string;
    image: string;
  }
> = {
  "vida-a-bordo": {
    slug: "vida-a-bordo",
    name: "Vida a Bordo",
    kicker: "Quadro 01",
    description:
      "Histórias e experiências de quem já viveu ou vive a vida de tripulante.",
    topics: [
      "Navios",
      "Bastidores",
      "Perrengues",
      "Relacionamentos",
      "Amizades",
      "Trabalho",
      "Passageiros",
      "Cabines",
      "Festas",
      "Situações absurdas",
    ],
    cta: "Explorar Vida a Bordo",
    image: "/quadros/vida-a-bordo.jpeg",
  },
  turbulencia: {
    slug: "turbulencia",
    name: "Turbulência",
    kicker: "Quadro 02",
    description:
      "Histórias que fazem você pensar: “Isso realmente aconteceu?”",
    topics: [
      "Viagens",
      "Avião",
      "Aeroporto",
      "Navio",
      "Hotel",
      "Passageiros",
      "Tripulantes",
      "Fora do roteiro",
    ],
    cta: "Entrar na Turbulência",
    image: "/quadros/turbulencia.jpeg",
  },
};

export type Episode = {
  slug: string;
  number: string;
  title: string;
  description: string;
  date: string;
  quadro: QuadroSlug;
  categories: string[];
  spotifyUrl: string;
  youtubeUrl?: string;
  /** Optional public image path (e.g. "/episodios/001.jpg"). Falls back to a graphic cover. */
  cover?: string;
  /** DEMO: placeholder content. Remove the flag when replacing with a real episode. */
  demo?: boolean;
};

// Mais recente primeiro. Numeração oficial é cronológica.
export const episodes: Episode[] = [
  {
    slug: "002-toxico-a-bordo",
    number: "002",
    title: "Tóxico a Bordo",
    description: "Uma história real sobre amor, manipulação e a coragem de recomeçar.",
    date: "29 de setembro",
    quadro: "vida-a-bordo",
    categories: ["Navio", "Relacionamentos"],
    spotifyUrl:
      "https://open.spotify.com/episode/5oURT5qlWtPvakpfKvAUCm?si=THj312MoSV6xnuNshaOJQw&utm_source=native-share-menu&nd=1&dlsi=c17838cfa3e24b1f",
    cover: "/episodios/toxico-a-bordo.jpeg",
  },
  {
    slug: "001-saco-proibido",
    number: "001",
    title: "Saco Proibido",
    description: "O primeiro episódio do quadro Vida a Bordo.",
    date: "23 de setembro",
    quadro: "vida-a-bordo",
    categories: ["Navio"],
    // Link individual ainda não fornecido: usa o perfil oficial do podcast.
    spotifyUrl,
    cover: "/quadros/vida-a-bordo.jpeg",
  },
];

export const storyCategories = [
  "Avião",
  "Navio",
  "Hotel",
  "Viagem",
  "Bastidores",
  "Perrengues",
  "Relacionamentos",
  "Histórias absurdas",
  "Histórias estranhas",
];

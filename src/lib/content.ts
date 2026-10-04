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

/*
 * ==================== CONTEÚDO DE DEMONSTRAÇÃO ====================
 * Os episódios abaixo são placeholders temporários (demo: true).
 * Substitua pelos episódios reais: número, título, descrição, data,
 * quadro, links do Spotify/YouTube e capa (opcional, em /public).
 * ==================================================================
 */
export const episodes: Episode[] = [
  {
    slug: "001-episodio-de-demonstracao",
    number: "001",
    title: "Título do episódio (demonstração)",
    description:
      "Descrição curta do episódio. Este card é um exemplo temporário e será substituído pelo primeiro episódio real.",
    date: "Em breve",
    quadro: "vida-a-bordo",
    categories: ["Navio", "Bastidores"],
    spotifyUrl,
    demo: true,
  },
  {
    slug: "002-episodio-de-demonstracao",
    number: "002",
    title: "Título do episódio (demonstração)",
    description:
      "Descrição curta do episódio. Conteúdo de exemplo para visualizar a estrutura da página.",
    date: "Em breve",
    quadro: "turbulencia",
    categories: ["Avião", "Perrengues"],
    spotifyUrl,
    demo: true,
  },
  {
    slug: "003-episodio-de-demonstracao",
    number: "003",
    title: "Título do episódio (demonstração)",
    description:
      "Descrição curta do episódio. Conteúdo de exemplo para visualizar a estrutura da página.",
    date: "Em breve",
    quadro: "vida-a-bordo",
    categories: ["Relacionamentos"],
    spotifyUrl,
    demo: true,
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

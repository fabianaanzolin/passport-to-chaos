// Official channels — do not replace these URLs.
export const spotifyUrl =
  "https://open.spotify.com/show/3pnAt7AZGwB2hoYEs45d7U?si=RueEwUTOS76nLt0odnxIRw&utm_source=copy-link";
export const instagramUrl = "https://www.instagram.com/passaporteparaocaos/";
export const facebookUrl =
  "https://www.facebook.com/profile.php?id=61594587063784";
export const youtubeUrl = "https://www.youtube.com/@PassaporteParaOCaos";

export const contactEmail = "contato@passaporteparaocaos.com.br";
export const storyMailto =
  "mailto:contato@passaporteparaocaos.com.br?subject=Minha%20hist%C3%B3ria%20para%20o%20Passaporte%20para%20o%20Caos";

export const mailtoWithSubject = (subject: string) =>
  `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;

// Public images (served from /public so they work on GitHub Pages).
export const images = {
  logo: "/passaporte-logo.jpeg",
  travel: "/passaporte-viagem.jpeg",
  adriele: "/adriele.jpeg",
  coast: "/historia-paisagem.png",
};

export const mainNav = [
  { to: "/", label: "Início" },
  { to: "/episodios", label: "Episódios" },
  { to: "/quadros", label: "Quadros" },
  { to: "/historias", label: "Histórias" },
  { to: "/conte-sua-historia", label: "Conte sua história" },
  { to: "/sobre", label: "Sobre" },
] as const;

export const pageMeta = (title: string, description: string) => [
  { title },
  { name: "description", content: description },
  { property: "og:title", content: title },
  { property: "og:description", content: description },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
];

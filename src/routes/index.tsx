import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Plane, ArrowUpRight, Headphones, Users, Luggage, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Passaporte para o Caos | Em breve" },
      {
        name: "description",
        content:
          "Histórias reais de viagens, perrengues, encontros inesperados e tudo o que não estava no roteiro.",
      },
      { property: "og:title", content: "Passaporte para o Caos | Em breve" },
      {
        property: "og:description",
        content: "Viajar também é se perder. Já já esse caos decola.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const spotifyUrl =
  "https://open.spotify.com/show/3pnAt7AZGwB2hoYEs45d7U?si=RueEwUTOS76nLt0odnxIRw&utm_source=copy-link";
const instagramUrl = "https://www.instagram.com/passaporteparaocaos/";
const facebookUrl = "https://www.facebook.com/profile.php?id=61594587063784";
const youtubeUrl = "https://www.youtube.com/@PassaporteParaOCaos";

function SpotifyIcon({
  className,
  strokeWidth = 0,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      strokeWidth={strokeWidth}
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.882 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.739.30 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C9.6 11.22 3.84 11.7 0 13.8c-.48.181-1.021-.06-1.2-.6-.18-.48.06-1.021.6-1.2 4.2-2.4 10.56-3 14.88-.72.48.3.6 1.02.3 1.5z" />
    </svg>
  );
}

function Index() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative mx-auto flex min-h-[88vh] max-w-[1440px] flex-col px-6 pb-14 pt-6 sm:px-10 lg:px-16 lg:pb-20 lg:pt-8">
        <header className="relative z-20 flex items-center justify-between border-b border-border pb-5">
          <img
            src="/passaporte-logo.jpeg"
            alt="Passaporte para o Caos"
            className="size-20 rounded-full object-cover sm:size-24"
          />
          <nav className="flex items-center gap-4 sm:gap-6">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
              aria-label="Instagram do Passaporte para o Caos"
            >
              <Instagram className="size-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
              aria-label="Facebook do Passaporte para o Caos"
            >
              <Facebook className="size-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">Facebook</span>
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
              aria-label="YouTube do Passaporte para o Caos"
            >
              <Youtube className="size-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">YouTube</span>
            </a>
          </nav>
        </header>

        <div className="relative z-10 grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:py-8">
          <div className="relative z-10 max-w-3xl lg:py-12">
            <p className="mb-6 font-sans text-[0.68rem] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              Histórias fora do roteiro
            </p>

            <h1 className="font-display text-[clamp(3.6rem,8vw,7.8rem)] leading-[0.86] font-semibold text-balance">
              Viajar também é <span className="text-accent">se perder.</span>
            </h1>

            <p className="mt-8 max-w-xl font-sans text-base leading-7 text-muted-foreground sm:text-lg">
              Histórias reais de viagens, perrengues, encontros inesperados e tudo o que não estava no roteiro.
            </p>

            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
              <p className="font-display text-2xl italic text-foreground sm:text-3xl">
                Já já esse caos decola.
              </p>

              <a
                href={spotifyUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Ouça Passaporte para o Caos no Spotify"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-7 font-sans text-sm font-bold text-primary-foreground shadow-[0_18px_44px_-22px_color-mix(in_oklab,var(--foreground)_52%,transparent)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <SpotifyIcon className="size-5" />
                Ouça no Spotify
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                aria-label="Acompanhe o Passaporte para o Caos no Instagram"
              >
                Acompanhe no Instagram
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>

          <div className="relative mt-8 mx-auto w-full max-w-[560px] lg:ml-auto lg:mt-0">
            <div className="route-line" aria-hidden="true">
              <Plane className="route-plane size-6 fill-current" />
            </div>

            <div className="travel-frame">
              <img
                src="/passaporte-viagem.jpeg"
                alt="Ilustração de uma viagem entre avião, navio, malas e passaporte"
                className="aspect-square w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-5 -left-4 rotate-[-5deg] border border-stamp bg-background px-4 py-3 font-sans text-[0.62rem] font-bold uppercase tracking-[0.18em] text-stamp shadow-sm sm:-left-8">
              Destino: inesperado
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary px-6 py-16 sm:px-10 lg:py-20">
        <p className="mx-auto max-w-4xl text-center font-display text-2xl leading-relaxed text-foreground sm:text-4xl sm:leading-snug">
          Algumas viagens viram lembranças. Outras viram histórias. As melhores talvez sejam justamente aquelas que não saíram como planejado.
        </p>
      </section>

      <section className="bg-background px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 font-sans text-[0.68rem] font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Envie sua história
          </p>

          <h2 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[0.95] font-semibold text-balance">
            Tem uma história para contar?
          </h2>

          <div className="mx-auto mt-8 max-w-2xl space-y-5 font-sans text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            <p>
              Você viveu uma história que parece mentira? Um perrengue inesquecível? Uma situação absurda a bordo? Um encontro que saiu completamente do roteiro? Então talvez essa história pertença ao Passaporte para o Caos.
            </p>
            <p>
              Enquanto nosso espaço para envio de histórias não fica pronto, você já pode mandar a sua diretamente para a gente.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href="mailto:contato@passaporteparaocaos.com.br?subject=Minha%20hist%C3%B3ria%20para%20o%20Passaporte%20para%20o%20Caos"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-7 font-sans text-sm font-bold text-primary-foreground shadow-[0_18px_44px_-22px_color-mix(in_oklab,var(--foreground)_52%,transparent)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              aria-label="Enviar minha história por e-mail para o Passaporte para o Caos"
            >
              Enviar minha história
            </a>

            <p className="font-sans text-sm text-muted-foreground">
              <a
                href="mailto:contato@passaporteparaocaos.com.br"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                contato@passaporteparaocaos.com.br
              </a>
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-2xl border-t border-border pt-8 text-left font-sans text-[0.82rem] leading-relaxed text-muted-foreground sm:text-sm sm:leading-relaxed">
            <p className="mb-3">
              Importante: o envio da história não significa publicação automática. A equipe do Passaporte para o Caos analisará o material antes de utilizá-lo.
            </p>
            <p className="mb-3">
              Para preservar a identidade do autor ou de outras pessoas mencionadas, informações identificáveis poderão ser alteradas, omitidas ou substituídas durante a edição, incluindo nomes, apelidos, cargos, empresas, navios, cidades, locais, datas, rotas ou outros detalhes que possam permitir a identificação de uma pessoa.
            </p>
            <p>
              Quando necessário, a história também poderá ser adaptada editorialmente para preservar o anonimato, sem alterar o sentido essencial do relato.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-background px-6 py-10 font-sans sm:px-10">
        <div className="mx-auto flex max-w-[1312px] flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
          <p>© 2026 Passaporte para o Caos. Todos os direitos reservados.</p>

          <div className="flex items-center gap-4 text-[0.68rem]">
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
              aria-label="Ouça Passaporte para o Caos no Spotify"
            >
              <SpotifyIcon className="size-3.5" />
              Spotify
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              aria-label="Instagram do Passaporte para o Caos"
            >
              <Instagram className="size-3.5" strokeWidth={1.8} />
              Instagram
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              aria-label="YouTube do Passaporte para o Caos"
            >
              <Youtube className="size-3.5" strokeWidth={1.8} />
              YouTube
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              aria-label="Facebook do Passaporte para o Caos"
            >
              <Facebook className="size-3.5" strokeWidth={1.8} />
              Facebook
            </a>
          </div>

          <p className="text-[0.68rem]">
            Produzido por{" "}
            <a
              href="https://www.anzolinconsultoria.com.br"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              Anzolin Consultoria
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

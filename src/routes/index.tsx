import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Plane, ArrowUpRight } from "lucide-react";

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

const instagramUrl = "https://www.instagram.com/";

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
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
            aria-label="Instagram do Passaporte para o Caos"
          >
            <Instagram className="size-4" strokeWidth={1.8} />
            Instagram
          </a>
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
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 font-sans text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Acompanhe no Instagram
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
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

      <footer className="bg-background px-6 py-10 font-sans sm:px-10">
        <div className="mx-auto flex max-w-[1312px] flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
          <p>© 2026 Passaporte para o Caos. Todos os direitos reservados.</p>

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

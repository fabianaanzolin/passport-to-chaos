import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageIntro, PageShell, StoryInvite } from "@/components/site/SiteChrome";
import { quadros } from "@/lib/content";
import { images, pageMeta } from "@/lib/site";

export const Route = createFileRoute("/quadros/")({
  head: () => ({
    meta: pageMeta(
      "Quadros | Passaporte para o Caos",
      "Conheça os quadros do Passaporte para o Caos: Vida a Bordo e Turbulência.",
    ),
  }),
  component: QuadrosPage,
});

/** Subtle wave texture (Vida a Bordo) — decorative, kept away from text. */
function Waves({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 60" fill="none" aria-hidden="true" className={className} preserveAspectRatio="none">
      {[10, 30, 50].map((y) => (
        <path key={y} d={`M0 ${y} q25 -12 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0`} stroke="currentColor" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

/** Dashed flight path (Turbulência). */
function FlightPath({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 120" fill="none" aria-hidden="true" className={className}>
      <path d="M2 110 C 90 20, 170 120, 250 50 S 360 10, 398 30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 7" />
    </svg>
  );
}

function Postmark({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none hidden size-24 sm:inline-flex items-center justify-center rounded-full border-2 border-dashed text-center font-sans text-[0.55rem] font-bold uppercase leading-tight tracking-[0.18em] ${className}`}
    >
      {children}
    </span>
  );
}

function QuadrosPage() {
  const vida = quadros["vida-a-bordo"];
  const turb = quadros.turbulencia;
  return (
    <PageShell>
      <PageIntro eyebrow="Quadros" title="Dois jeitos de sair do roteiro.">
        <p>Cada quadro reúne um tipo de história. Escolha por onde começar.</p>
      </PageIntro>

      {/* VIDA A BORDO — arte à esquerda, texto à direita */}
      <section className="relative overflow-hidden border-t border-border bg-secondary">
        <Waves className="pointer-events-none absolute bottom-0 left-0 h-10 w-full text-stamp/15" preserveAspectRatio="none" />
        <div className="relative mx-auto grid max-w-[1312px] items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16 lg:py-20">
          <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:max-w-none">
            <img
              src={vida.image}
              alt="Arte oficial do quadro Vida a Bordo"
              className="w-full -rotate-2 rounded-full shadow-[0_30px_60px_-34px_color-mix(in_oklab,var(--foreground)_60%,transparent)]"
            />
            <Postmark className="absolute -right-2 -top-2 rotate-12 border-stamp/50 bg-secondary/80 text-stamp sm:-right-4">
              Quadro 01
            </Postmark>
          </div>

          <div className="max-w-xl">
            <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-stamp">
              {vida.kicker} · A bordo
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.9] font-semibold">{vida.name}</h2>
            <p className="mt-6 font-display text-[clamp(1.6rem,3vw,2.3rem)] italic leading-tight">
              “O que acontece a bordo nem sempre fica a bordo.”
            </p>
            <p className="mt-5 font-sans text-base leading-7 text-foreground sm:text-lg">
              Histórias de quem viveu o que os passageiros nunca viram.
            </p>
            <p className="mt-2 font-sans text-sm leading-6 text-muted-foreground">{vida.description}</p>
            <Link
              to="/quadros/vida-a-bordo"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-accent pb-1 font-sans text-sm font-bold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-accent"
            >
              {vida.cta} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TURBULÊNCIA — texto à esquerda, arte à direita */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <FlightPath className="pointer-events-none absolute right-[8%] top-3 hidden w-[38%] text-accent/40 lg:block" />
        <div className="relative mx-auto grid max-w-[1312px] items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:gap-16 lg:py-20">
          <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:order-2 lg:max-w-none">
            <img
              src={turb.image}
              alt="Arte oficial do quadro Turbulência"
              className="w-full rotate-3 rounded-full shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--foreground)_90%,transparent)]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 bottom-6 hidden sm:block -rotate-[10deg] border-2 border-accent bg-primary px-3 py-1.5 font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] text-accent"
            >
              Fora do roteiro
            </span>
          </div>

          <div className="max-w-xl lg:order-1">
            <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-primary-foreground/70">
              {turb.kicker} · Rota alterada
            </p>
            <h2 className="mt-4 -skew-x-6 font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.9] font-semibold">
              {turb.name}
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-6 font-display text-[clamp(1.6rem,3vw,2.3rem)] italic leading-tight">
              Histórias que começam normais. Até deixarem de ser.
            </p>
            <p className="mt-4 font-display text-2xl italic text-accent">“Isso realmente aconteceu?”</p>
            <p className="mt-5 font-sans text-sm leading-6 text-primary-foreground/80 sm:text-base sm:leading-7">
              Histórias de viagens, aviões, aeroportos, navios, hotéis e situações completamente fora do roteiro.
            </p>
            <Link
              to="/quadros/turbulencia"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-accent pb-1 font-sans text-sm font-bold uppercase tracking-[0.14em] transition-colors hover:text-accent"
            >
              {turb.cta} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Assinatura discreta */}
      <div className="mx-auto flex max-w-[1312px] items-center gap-4 px-6 pt-14 sm:px-10">
        <img src={images.logo} alt="" aria-hidden="true" className="size-12 rounded-full object-cover opacity-90" />
        <span className="h-px flex-1 border-t border-dashed border-border" />
        <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.24em] text-muted-foreground">
          Passaporte para o Caos
        </span>
      </div>

      <StoryInvite />
    </PageShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageIntro, PageShell, StoryInvite } from "@/components/site/SiteChrome";
import { quadros } from "@/lib/content";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/quadros/")({
  head: () => ({
    meta: pageMeta(
      "Quadros | Passaporte para o Caos",
      "Conheça os quadros do Passaporte para o Caos: Vida a Bordo e Turbulência.",
    ),
  }),
  component: QuadrosPage,
});

function QuadrosPage() {
  const vida = quadros["vida-a-bordo"];
  const turb = quadros.turbulencia;
  return (
    <PageShell>
      <PageIntro eyebrow="Quadros" title="Dois jeitos de sair do roteiro.">
        <p>Cada quadro reúne um tipo de história. Escolha por onde começar.</p>
      </PageIntro>

      <section className="mx-auto grid max-w-[1312px] gap-6 px-6 pb-20 sm:px-10 lg:grid-cols-2">
        <article className="flex flex-col border border-border bg-secondary p-8 sm:p-10 lg:min-h-[520px]">
          <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-stamp">{vida.kicker}</p>
          <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.9] font-semibold">{vida.name}</h2>
          <p className="mt-6 max-w-md font-sans text-base leading-7 text-muted-foreground sm:text-lg">{vida.description}</p>
          <p className="mt-6 max-w-md font-sans text-xs uppercase tracking-[0.14em] leading-6 text-muted-foreground">
            {vida.topics.join(" · ")}
          </p>
          <Link to="/quadros/vida-a-bordo" className="mt-auto inline-flex min-h-12 items-center gap-2 self-start pt-10 font-sans text-sm font-bold uppercase tracking-[0.14em] text-foreground hover:text-accent">
            {vida.cta} <ArrowRight className="size-4" />
          </Link>
        </article>

        <article className="relative flex flex-col overflow-hidden bg-primary p-8 text-primary-foreground sm:p-10 lg:min-h-[520px]">
          <span className="pointer-events-none absolute -right-6 top-10 rotate-[-8deg] border-2 border-accent px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Fora do roteiro
          </span>
          <p className="font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-primary-foreground/70">{turb.kicker}</p>
          <h2 className="mt-6 -skew-x-6 font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.9] font-semibold">
            {turb.name}<span className="text-accent">.</span>
          </h2>
          <p className="mt-6 max-w-md font-sans text-base leading-7 text-primary-foreground/85 sm:text-lg">
            Histórias que fazem você pensar:
          </p>
          <p className="mt-2 font-display text-3xl italic">“Isso realmente aconteceu?”</p>
          <p className="mt-6 max-w-md font-sans text-xs uppercase tracking-[0.14em] leading-6 text-primary-foreground/70">
            {turb.topics.join(" · ")}
          </p>
          <Link to="/quadros/turbulencia" className="mt-auto inline-flex min-h-12 items-center gap-2 self-start pt-10 font-sans text-sm font-bold uppercase tracking-[0.14em] hover:text-accent">
            {turb.cta} <ArrowRight className="size-4" />
          </Link>
        </article>
      </section>

      <StoryInvite />
    </PageShell>
  );
}

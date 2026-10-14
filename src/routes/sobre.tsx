import { createFileRoute } from "@tanstack/react-router";
import { Headphones, Heart, Luggage, Users } from "lucide-react";
import { Eyebrow, PageShell, StoryInvite } from "@/components/site/SiteChrome";
import { images, pageMeta } from "@/lib/site";
import { imageFor, paragraphs, useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: pageMeta(
      "Sobre | Passaporte para o Caos",
      "O Passaporte para o Caos nasceu de uma ideia simples: as melhores histórias de uma viagem quase nunca estavam no roteiro.",
    ),
  }),
  component: SobrePage,
});

const pillars = [
  { label: "Podcast", Icon: Headphones },
  { label: "Comunidade", Icon: Users },
  { label: "Viagens", Icon: Luggage },
  { label: "Histórias reais", Icon: Heart },
];

function SobrePage() {
  const c = useSiteContent();
  return (
    <PageShell>
      <section className="mx-auto max-w-[1312px] px-6 pb-16 pt-14 sm:px-10 lg:pt-20">
        <Eyebrow>Sobre</Eyebrow>
        <h1 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.9] font-semibold text-balance">
          {c.sobre.title}
        </h1>
        <div className="mt-10 max-w-2xl space-y-5 font-sans text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {paragraphs(c.sobre.text).map((p) => <p key={p}>{p}</p>)}
          <p className="font-display text-2xl italic text-foreground sm:text-3xl">Bem-vindo ao Passaporte para o Caos.</p>
        </div>
      </section>

      <section className="border-t border-border bg-background px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1312px] gap-12 lg:grid-cols-[0.82fr_1.15fr_0.68fr] lg:items-start lg:gap-10">
          <figure className="relative mx-auto w-full max-w-[320px] rotate-[-2.5deg] lg:mx-0">
            <div className="border border-border bg-primary-foreground p-2.5 shadow-[0_22px_56px_-32px_color-mix(in_oklab,var(--foreground)_45%,transparent)]">
              <img src={imageFor(c, "perfil", c.perfil.photo) || images.adriele} alt="Adriele, criadora do Passaporte para o Caos" className="aspect-square w-full object-cover" />
              <figcaption className="pb-1 pt-3 text-center font-display text-lg italic text-muted-foreground">
                Viajar é colecionar histórias. <span className="text-accent">&#9825;</span>
              </figcaption>
            </div>
            <div className="absolute -right-3 -top-3 rotate-[8deg] border border-stamp bg-background px-2.5 py-1.5 font-sans text-[0.55rem] font-bold uppercase tracking-[0.16em] text-stamp shadow-sm">
              Passaporte
            </div>
          </figure>

          <div className="lg:pt-4">
            <Eyebrow>Quem conta</Eyebrow>
            <h2 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.92] font-semibold">{c.perfil.name}</h2>
            <div className="mt-6 max-w-xl space-y-4 font-sans text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {paragraphs(c.perfil.bio).map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:pt-4">
            {pillars.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-secondary text-foreground">
                  <Icon className="size-[1.15rem]" strokeWidth={1.6} />
                </span>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.18em]">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <StoryInvite />
    </PageShell>
  );
}

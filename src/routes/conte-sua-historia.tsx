import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { PageShell, StoryNotice } from "@/components/site/SiteChrome";
import { contactEmail, images, pageMeta, storyMailto } from "@/lib/site";

export const Route = createFileRoute("/conte-sua-historia")({
  head: () => ({
    meta: pageMeta(
      "Conte sua história | Passaporte para o Caos",
      "Viveu uma história de viagem que parece mentira? Envie para o Passaporte para o Caos.",
    ),
  }),
  component: ContePage,
});

function ContePage() {
  return (
    <PageShell>
      <section className="relative mt-8 w-full overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={images.coast} alt="" className="size-full object-cover" style={{ objectPosition: "60% 35%" }} />
          <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--primary)_44%,transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--primary)_90%,transparent),color-mix(in_oklab,var(--primary)_30%,transparent)_58%,transparent)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1312px] flex-col justify-center px-6 py-16 sm:px-10 lg:min-h-[560px]">
          <div className="max-w-2xl text-primary-foreground">
            <p className="mb-5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.28em] text-primary-foreground/80">
              Passaporte para o Caos
            </p>
            <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] font-semibold [text-shadow:0_2px_18px_color-mix(in_oklab,black_60%,transparent)]">
              Conte sua história
            </h1>
            <p className="mt-6 font-sans text-base leading-7 text-primary-foreground/90 sm:text-lg sm:leading-8 [text-shadow:0_1px_10px_color-mix(in_oklab,black_55%,transparent)]">
              Você viveu uma história que parece mentira? Um perrengue inesquecível? Uma situação
              absurda a bordo? Um encontro que saiu completamente do roteiro? Então talvez essa
              história pertença ao Passaporte para o Caos.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4">
              <a
                href={storyMailto}
                aria-label="Enviar minha história por e-mail para o Passaporte para o Caos"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-7 font-sans text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <Send className="size-4" strokeWidth={1.8} />
                Enviar minha história
              </a>
              <a href={`mailto:${contactEmail}`} className="font-sans text-sm text-primary-foreground/80 underline decoration-primary-foreground/40 underline-offset-4 hover:text-primary-foreground">
                {contactEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <StoryNotice />
        </div>
      </section>
    </PageShell>
  );
}

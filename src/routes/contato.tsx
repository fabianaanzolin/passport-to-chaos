import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, PageShell } from "@/components/site/SiteChrome";
import { contactEmail, mailtoWithSubject, pageMeta, storyMailto } from "@/lib/site";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: pageMeta(
      "Contato | Passaporte para o Caos",
      "Fale com o Passaporte para o Caos: envio de histórias, contato geral, publicidade e parcerias.",
    ),
  }),
  component: ContatoPage,
});

const channels = [
  { title: "Histórias", text: "Quer contar uma história que saiu do roteiro?", href: storyMailto },
  { title: "Contato geral", text: "Dúvidas, sugestões ou só um oi.", href: mailtoWithSubject("Contato — Passaporte para o Caos") },
  { title: "Publicidade e parcerias", text: "Para marcas e projetos que combinam com o caos.", href: mailtoWithSubject("Publicidade e parcerias — Passaporte para o Caos") },
];

function ContatoPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Contato" title="Fale com a gente.">
        <p>
          Por enquanto, todos os assuntos chegam pelo mesmo e-mail:{" "}
          <a href={`mailto:${contactEmail}`} className="text-foreground underline decoration-border underline-offset-4 hover:text-accent">
            {contactEmail}
          </a>
        </p>
      </PageIntro>
      <section className="mx-auto grid max-w-[1312px] gap-6 px-6 pb-24 sm:px-10 md:grid-cols-3">
        {channels.map((c) => (
          <a key={c.title} href={c.href} className="group flex min-h-[220px] flex-col border border-border bg-secondary p-7 transition-colors hover:bg-background">
            <h2 className="font-display text-3xl font-semibold leading-tight">{c.title}</h2>
            <p className="mt-3 font-sans text-sm leading-6 text-muted-foreground">{c.text}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-8 font-sans text-xs font-bold uppercase tracking-[0.16em] group-hover:text-accent">
              Enviar e-mail <ArrowUpRight className="size-3.5" />
            </span>
          </a>
        ))}
      </section>
    </PageShell>
  );
}

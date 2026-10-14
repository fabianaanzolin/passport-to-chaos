import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageTitle, adminMeta } from "@/components/admin/admin-ui";
import { SaveBar, TextInput, useContentForm } from "@/components/admin/content-form";

export const Route = createFileRoute("/admin/conteudo")({
  head: () => ({ meta: adminMeta("Conteúdo do site") }),
  component: Content,
});

function Block({ title, hint, children, onSubmit }: { title: string; hint: string; children: ReactNode; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-border bg-background p-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-1 font-sans text-xs text-muted-foreground">{hint}</p>
      </div>
      {children}
    </form>
  );
}

function Content() {
  const hero = useContentForm("hero");
  const sobre = useContentForm("sobre");
  const hist = useContentForm("historia");
  return (
    <div>
      <PageTitle title="Conteúdo do site" />
      <p className="mb-6 max-w-2xl font-sans text-sm text-muted-foreground">
        Edite apenas os textos. Layout, cores e fontes do site continuam protegidos. Para separar parágrafos, deixe uma linha em branco.
      </p>
      <div className="grid max-w-3xl gap-8">
        <Block title="Hero" hint="Topo da página inicial." onSubmit={hero.submit}>
          <TextInput id="hero-title" label="Título" value={hero.value.title} onChange={(title) => hero.set({ title })} />
          <TextInput id="hero-hl" label="Final do título (em vermelho)" value={hero.value.highlight} onChange={(highlight) => hero.set({ highlight })} />
          <TextInput id="hero-sub" label="Texto de apoio" value={hero.value.subtitle} onChange={(subtitle) => hero.set({ subtitle })} multiline />
          <SaveBar busy={hero.busy} msg={hero.msg} />
        </Block>
        <Block title="Sobre" hint="Apresentação do podcast na página Sobre." onSubmit={sobre.submit}>
          <TextInput id="sobre-title" label="Título" value={sobre.value.title} onChange={(title) => sobre.set({ title })} />
          <TextInput id="sobre-text" label="Apresentação" value={sobre.value.text} onChange={(text) => sobre.set({ text })} multiline />
          <SaveBar busy={sobre.busy} msg={sobre.msg} />
        </Block>
        <Block title="Conte sua história" hint="Faixa da página inicial e página Conte sua história." onSubmit={hist.submit}>
          <TextInput id="hist-title" label="Chamada" value={hist.value.title} onChange={(title) => hist.set({ title })} />
          <TextInput id="hist-text" label="Texto" value={hist.value.text} onChange={(text) => hist.set({ text })} multiline />
          <TextInput id="hist-extra" label="Texto complementar (página inicial)" value={hist.value.extra} onChange={(extra) => hist.set({ extra })} multiline />
          <SaveBar busy={hist.busy} msg={hist.msg} />
        </Block>
      </div>
    </div>
  );
}

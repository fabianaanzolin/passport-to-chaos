import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { PageTitle, adminMeta, inputClass } from "@/components/admin/admin-ui";
import { Field, SaveBar, useContentForm } from "@/components/admin/content-form";

export const Route = createFileRoute("/admin/links")({
  head: () => ({ meta: adminMeta("Links e redes") }),
  component: Links,
});

const fields = [
  ["spotify", "Spotify — link oficial do podcast"],
  ["youtube", "YouTube — link oficial do canal"],
  ["instagram", "Instagram — link oficial do perfil"],
  ["facebook", "Facebook — link oficial da página"],
] as const;

const isUrl = (v: string) => { try { return new URL(v).protocol === "https:" && !/\s/.test(v); } catch { return false; } };
const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

function Links() {
  const f = useContentForm("links", (v) => {
    for (const [k, label] of fields) if (!isUrl(v[k].trim())) return `Confira o link: ${label.split(" —")[0]}. Ele deve começar com https://`;
    return isEmail(v.email.trim()) ? null : "Confira o e-mail de contato.";
  });
  return (
    <div>
      <PageTitle title="Links e redes" />
      <p className="mb-6 max-w-2xl font-sans text-sm text-muted-foreground">
        Esses links aparecem no topo, no rodapé e nos botões do site. Os links de cada episódio são editados em Episódios.
      </p>
      <form onSubmit={f.submit} className="max-w-3xl space-y-5 border border-border bg-background p-6">
        {fields.map(([k, label]) => (
          <Field key={k} id={`link-${k}`} label={label}>
            <div className="flex gap-2">
              <input id={`link-${k}`} type="url" value={f.value[k]} onChange={(e) => f.set({ [k]: e.target.value })} className={inputClass} />
              <a href={f.value[k]} target="_blank" rel="noreferrer" aria-label={`Abrir link do ${k} para conferir`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 font-sans text-xs font-bold uppercase tracking-[0.12em] hover:border-foreground">
                <ExternalLink className="size-3.5" /> Abrir
              </a>
            </div>
          </Field>
        ))}
        <Field id="link-email" label="E-mail de contato">
          <input id="link-email" type="email" value={f.value.email} onChange={(e) => f.set({ email: e.target.value })} className={inputClass} />
        </Field>
        <SaveBar busy={f.busy} msg={f.msg} />
      </form>
    </div>
  );
}

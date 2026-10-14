import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, adminMeta, inputClass } from "@/components/admin/admin-ui";
import { Field, ImageField, SaveBar, TextInput, useContentForm } from "@/components/admin/content-form";

export const Route = createFileRoute("/admin/quadros")({
  head: () => ({ meta: adminMeta("Quadros") }),
  component: () => (
    <div>
      <PageTitle title="Quadros" />
      <div className="grid gap-8 xl:grid-cols-2">
        <QuadroForm slug="vida-a-bordo" />
        <QuadroForm slug="turbulencia" />
      </div>
    </div>
  ),
});

function QuadroForm({ slug }: { slug: "vida-a-bordo" | "turbulencia" }) {
  const f = useContentForm(`quadro:${slug}`, (v) => (v.name.trim() ? null : "Informe o nome do quadro."));
  const v = f.value;
  return (
    <form onSubmit={f.submit} className="space-y-5 border border-border bg-background p-6">
      <p className="font-display text-2xl font-semibold">{v.name || slug}</p>
      <TextInput id={`${slug}-name`} label="Nome" value={v.name} onChange={(name) => f.set({ name })} />
      <TextInput id={`${slug}-phrase`} label="Frase" value={v.phrase} onChange={(phrase) => f.set({ phrase })} />
      <TextInput id={`${slug}-desc`} label="Descrição" value={v.description} onChange={(description) => f.set({ description })} multiline />
      <ImageField id={`quadro-${slug}`} label="Arte" value={v.image} onChange={(image) => f.set({ image })} round />
      <Field id={`${slug}-status`} label="Status">
        <select id={`${slug}-status`} value={v.status} onChange={(e) => f.set({ status: e.target.value })} className={inputClass}>
          <option value="active">Ativo — aparece na página Quadros</option>
          <option value="inactive">Inativo — fica oculto na página Quadros</option>
        </select>
      </Field>
      <SaveBar busy={f.busy} msg={f.msg} />
    </form>
  );
}

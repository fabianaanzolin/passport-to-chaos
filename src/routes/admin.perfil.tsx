import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, adminMeta } from "@/components/admin/admin-ui";
import { ImageField, SaveBar, TextInput, useContentForm } from "@/components/admin/content-form";

export const Route = createFileRoute("/admin/perfil")({
  head: () => ({ meta: adminMeta("Perfil") }),
  component: Profile,
});

function Profile() {
  const f = useContentForm("perfil", (v) => (v.name.trim() ? null : "Informe o nome."));
  return (
    <div>
      <PageTitle title="Perfil" />
      <form onSubmit={f.submit} className="max-w-3xl space-y-5 border border-border bg-background p-6">
        <ImageField id="perfil-foto" label="Foto" value={f.value.photo} onChange={(photo) => f.set({ photo })} />
        <TextInput id="perfil-nome" label="Nome" value={f.value.name} onChange={(name) => f.set({ name })} />
        <TextInput id="perfil-bio" label="Biografia (linha em branco separa parágrafos)" value={f.value.bio} onChange={(bio) => f.set({ bio })} multiline />
        <SaveBar busy={f.busy} msg={f.msg} />
      </form>
    </div>
  );
}

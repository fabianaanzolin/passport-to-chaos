import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageTitle, adminMeta, useAdmin } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin/configuracoes")({
  head: () => ({ meta: adminMeta("Configurações") }),
  component: Settings,
});

function Settings() {
  const { role } = useAdmin();
  const { data = [] } = useQuery({
    queryKey: ["staff"],
    enabled: role === "admin",
    queryFn: async () => (await supabase.from("staff_members").select("email, role").order("role")).data ?? [],
  });
  if (role !== "admin") {
    return <div><PageTitle title="Configurações" /><p className="font-sans text-sm text-muted-foreground">Esta área é exclusiva do perfil Administrador.</p></div>;
  }
  return (
    <div>
      <PageTitle title="Configurações" />
      <h2 className="mb-3 font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-muted-foreground">Acessos ao painel</h2>
      <ul className="divide-y divide-border border border-border bg-background font-sans text-sm">
        {data.map((s) => (
          <li key={s.email} className="flex justify-between px-5 py-3">
            <span>{s.email}</span>
            <span className="font-bold uppercase tracking-[0.12em] text-[0.65rem] text-stamp">{s.role === "admin" ? "Administrador" : "Editor"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

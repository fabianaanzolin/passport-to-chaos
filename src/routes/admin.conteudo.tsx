import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, adminMeta } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin/conteudo")({
  head: () => ({ meta: adminMeta("Conteúdo do site") }),
  component: () => (
    <ComingSoon title="Conteúdo do site">
      Aqui você vai poder editar os textos do Hero, da página Sobre e de Conte sua história, sem mexer no
      visual do site. Cores, fontes e layout continuam protegidos.
    </ComingSoon>
  ),
});

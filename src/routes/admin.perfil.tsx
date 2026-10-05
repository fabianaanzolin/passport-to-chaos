import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, adminMeta } from "@/components/admin/admin-ui";
import { images } from "@/lib/site";

export const Route = createFileRoute("/admin/perfil")({
  head: () => ({ meta: adminMeta("Perfil") }),
  component: () => (
    <ComingSoon title="Perfil">
      <div className="flex items-center gap-4">
        <img src={images.adriele} alt="Adriele" className="size-16 rounded-full object-cover" />
        <p><strong className="text-foreground">Adriele</strong><br />Em breve: edição de nome, bio e foto. A página Sobre continua como está até lá.</p>
      </div>
    </ComingSoon>
  ),
});

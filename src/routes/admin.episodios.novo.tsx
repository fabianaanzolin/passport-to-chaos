import { createFileRoute } from "@tanstack/react-router";
import { EpisodeForm } from "@/components/admin/EpisodeForm";
import { PageTitle, adminMeta } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin/episodios/novo")({
  head: () => ({ meta: adminMeta("Novo episódio") }),
  component: () => (
    <div>
      <PageTitle title="Novo episódio" />
      <EpisodeForm />
    </div>
  ),
});

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EpisodeForm } from "@/components/admin/EpisodeForm";
import { PageTitle, adminMeta, ghostBtn } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin/episodios/editar")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : "" }),
  head: () => ({ meta: adminMeta("Editar episódio") }),
  component: EditEpisode,
});

function EditEpisode() {
  const { id } = Route.useSearch();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-episode", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await supabase.from("episodes").select("*").eq("id", id).maybeSingle();
      return data;
    },
  });

  if (isLoading) return <p className="font-sans text-sm text-muted-foreground">Carregando…</p>;
  if (!data) {
    return (
      <div>
        <PageTitle title="Episódio não encontrado" />
        <Link to="/admin/episodios" className={ghostBtn}>Voltar para episódios</Link>
      </div>
    );
  }
  return (
    <div>
      <PageTitle title={`Editar #${data.number}`} />
      <EpisodeForm key={data.id} episode={data} />
    </div>
  );
}

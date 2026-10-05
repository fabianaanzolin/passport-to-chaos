import { supabase } from "@/integrations/supabase/client";

export const adminEpisodesQuery = {
  queryKey: ["admin-episodes"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("episodes").select("*")
      .order("published_on", { ascending: false, nullsFirst: true })
      .order("number", { ascending: false });
    if (error) throw error;
    return data;
  },
};

export function StatusBadge({ status }: { status: string }) {
  const pub = status === "published";
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] ${pub ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
      {pub ? "Publicado" : "Rascunho"}
    </span>
  );
}


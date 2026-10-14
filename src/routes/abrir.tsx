import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageShell } from "@/components/site/SiteChrome";

// GitHub Pages serves public/404.html for addresses that did not exist at publish time
// (new Quadros and episodes). That file sends the visitor here with the original address,
// and this page opens it inside the site.
export const Route = createFileRoute("/abrir")({
  head: () => ({
    meta: [
      { title: "Abrindo… | Passaporte para o Caos" },
      { name: "description", content: "Abrindo a página do Passaporte para o Caos." },
      { property: "og:title", content: "Passaporte para o Caos" },
      { property: "og:description", content: "Histórias reais de viagens e tudo o que não estava no roteiro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Abrir,
});

function Abrir() {
  const router = useRouter();
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("p") ?? "/";
    const safe = p.startsWith("/") && !p.startsWith("//") && !p.startsWith("/abrir") ? p : "/";
    router.history.replace(safe);
  }, [router]);
  return (
    <PageShell>
      <p className="mx-auto max-w-xl px-6 py-24 text-center font-display text-3xl">Abrindo…</p>
    </PageShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CustomQuadroPage, QuadroPage } from "@/components/site/QuadroPage";
import { pageMeta } from "@/lib/site";

// Quadros created in the admin. They load in the browser; on GitHub Pages a direct
// link reaches this page through public/404.html → /abrir.
export const Route = createFileRoute("/quadros/$slug")({
  head: () => ({ meta: pageMeta("Quadro | Passaporte para o Caos", "Um quadro do podcast Passaporte para o Caos.") }),
  component: QuadroBySlug,
});

function QuadroBySlug() {
  const { slug } = Route.useParams();
  if (slug === "vida-a-bordo" || slug === "turbulencia") return <QuadroPage slug={slug} />;
  return <CustomQuadroPage slug={slug} />;
}

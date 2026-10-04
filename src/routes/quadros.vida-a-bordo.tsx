import { createFileRoute } from "@tanstack/react-router";
import { QuadroPage } from "@/components/site/QuadroPage";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/quadros/vida-a-bordo")({
  head: () => ({
    meta: pageMeta(
      "Vida a Bordo | Passaporte para o Caos",
      "Histórias e experiências de quem já viveu ou vive a vida de tripulante: navios, bastidores, perrengues e situações absurdas.",
    ),
  }),
  component: () => <QuadroPage slug="vida-a-bordo" />,
});

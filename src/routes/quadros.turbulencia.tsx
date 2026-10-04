import { createFileRoute } from "@tanstack/react-router";
import { QuadroPage } from "@/components/site/QuadroPage";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/quadros/turbulencia")({
  head: () => ({
    meta: pageMeta(
      "Turbulência | Passaporte para o Caos",
      "Histórias de viagem que fazem você pensar: isso realmente aconteceu? Avião, aeroporto, navio, hotel e tudo fora do roteiro.",
    ),
  }),
  component: () => <QuadroPage slug="turbulencia" />,
});

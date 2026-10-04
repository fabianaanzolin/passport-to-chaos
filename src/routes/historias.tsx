import { createFileRoute, Navigate } from "@tanstack/react-router";

// Arquivo de histórias fora da experiência nesta fase (sem histórias reais suficientes).
// A rota continua existindo apenas para links antigos: leva o visitante à página inicial.
export const Route = createFileRoute("/historias")({
  head: () => ({
    meta: [
      { title: "Passaporte para o Caos" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <Navigate to="/" replace />,
});

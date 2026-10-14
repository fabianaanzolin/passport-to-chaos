import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { resolveCover } from "./episodes-db";
import { quadros as baseQuadros } from "./content";

export type QuadroRow = Tables<"quadros">;
/** A Quadro created in the admin, with its image resolved for display. */
export type CustomQuadro = QuadroRow & { imageUrl: string };

export const BUILT_IN = ["vida-a-bordo", "turbulencia"] as const;
export const isBuiltIn = (slug: string) => (BUILT_IN as readonly string[]).includes(slug);

export function quadroSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let state: { list: CustomQuadro[]; loaded: boolean } = { list: [], loaded: false };
const empty = state;
const listeners = new Set<() => void>();
let started = false;

async function load() {
  // Signed-in staff see inactive ones too (policies decide); the public sees only active ones.
  const { data } = await supabase.from("quadros").select("*").order("created_at");
  const list = await Promise.all(
    (data ?? []).map(async (q) => ({ ...q, imageUrl: (await resolveCover(q.image)) ?? "" })),
  );
  state = { list, loaded: true };
  listeners.forEach((l) => l());
}

export const refreshQuadros = () => load();

export function useCustomQuadros() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      if (!started && typeof window !== "undefined") {
        started = true;
        load().catch(() => {});
      }
      return () => listeners.delete(cb);
    },
    () => state,
    () => empty,
  );
}

/** Display name for any Quadro slug (built-in or created in the admin). */
export function useQuadroName() {
  const { list } = useCustomQuadros();
  return (slug: string) =>
    (baseQuadros as Record<string, { name: string }>)[slug]?.name ?? list.find((q) => q.slug === slug)?.name ?? "Quadro";
}

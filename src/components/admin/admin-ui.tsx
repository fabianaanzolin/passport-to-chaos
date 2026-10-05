import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { images } from "@/lib/site";

export type StaffRole = "admin" | "editor";
export const AdminContext = createContext<{ user: User; role: StaffRole } | null>(null);
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin outside admin");
  return ctx;
}

export const adminMeta = (title: string) => [
  { title: `${title} | Admin · Passaporte para o Caos` },
  { name: "description", content: "Área administrativa do Passaporte para o Caos." },
  { name: "robots", content: "noindex, nofollow" },
];

export const inputClass =
  "w-full rounded-md border border-input bg-background px-3.5 py-2.5 font-sans text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
export const labelClass = "mb-1.5 block font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground";
export const primaryBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 font-sans text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition hover:opacity-90 disabled:opacity-50";
export const ghostBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-5 font-sans text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:border-foreground disabled:opacity-50";

export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-5 py-12">
      <div className="w-full max-w-sm border border-border bg-background p-8 shadow-[0_24px_60px_-40px_color-mix(in_oklab,var(--foreground)_50%,transparent)]">
        <div className="mb-7 flex flex-col items-center text-center">
          <img src={images.logo} alt="Passaporte para o Caos" className="size-16 rounded-full object-cover" />
          <p className="mt-4 font-sans text-[0.62rem] font-bold uppercase tracking-[0.28em] text-muted-foreground">
            Passaporte para o Caos
          </p>
          <p className="mt-1 inline-block rotate-[-2deg] border-2 border-stamp px-2.5 py-0.5 font-sans text-[0.6rem] font-bold uppercase tracking-[0.3em] text-stamp">
            Admin
          </p>
          <h1 className="mt-5 font-display text-2xl font-semibold">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Notice({ tone = "ok", children }: { tone?: "ok" | "error"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-md px-3.5 py-2.5 font-sans text-sm ${tone === "error" ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground"}`}
    >
      {children}
    </p>
  );
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <h1 className="font-display text-4xl font-semibold">{title}</h1>
      {children}
    </div>
  );
}

export function ComingSoon({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div>
      <PageTitle title={title} />
      <div className="max-w-2xl border border-dashed border-border p-6 font-sans text-sm leading-6 text-muted-foreground">
        <p className="mb-3 font-bold uppercase tracking-[0.16em] text-[0.65rem] text-stamp">Em preparação</p>
        {children}
      </div>
    </div>
  );
}

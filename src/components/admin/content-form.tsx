import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { COVER_BUCKET, resolveCover } from "@/lib/episodes-db";
import { saveContent, useSiteContent, type ContentKey, type SiteContent } from "@/lib/site-content";
import { Notice, inputClass, labelClass, primaryBtn } from "./admin-ui";

/** Form state for one editable block, preloaded with what the site shows today. */
export function useContentForm<K extends ContentKey>(key: K, validate?: (v: SiteContent[K]) => string | null) {
  const current = useSiteContent()[key];
  const [value, setValue] = useState<SiteContent[K]>(current);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  useEffect(() => { if (!dirty) setValue(current); }, [current, dirty]);

  const set = (patch: Partial<SiteContent[K]>) => { setDirty(true); setMsg(null); setValue((v) => ({ ...v, ...patch })); };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = validate?.(value);
    if (problem) return setMsg({ tone: "error", text: problem });
    setBusy(true);
    const error = await saveContent(key, value);
    setBusy(false);
    if (error) setMsg({ tone: "error", text: /inválid/i.test(error.message) ? error.message : "Não foi possível salvar. Tente novamente." });
    else { setDirty(false); setMsg({ tone: "ok", text: "Alterações salvas. O site já mostra a nova versão." }); }
  };
  return { value, set, submit, busy, msg };
}

export function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div><label htmlFor={id} className={labelClass}>{label}</label>{children}</div>;
}

export function TextInput({ id, label, value, onChange, multiline }: { id: string; label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <Field id={id} label={label}>
      {multiline
        ? <textarea id={id} rows={6} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        : <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />}
    </Field>
  );
}

export function SaveBar({ busy, msg }: { busy: boolean; msg: { tone: "ok" | "error"; text: string } | null }) {
  return (
    <div className="space-y-3">
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <button type="submit" disabled={busy} className={primaryBtn}>{busy ? "Salvando…" : "Salvar alterações"}</button>
    </div>
  );
}

/** Uploads to the private bucket and stores the file path; shows a preview. */
export function ImageField({ id, label, value, onChange, round }: { id: string; label: string; value: string; onChange: (v: string) => void; round?: boolean }) {
  const [preview, setPreview] = useState<string>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { resolveCover(value).then(setPreview); }, [value]);

  const pick = async (file?: File) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) return setError("Escolha um arquivo de imagem.");
    if (file.size > 5 * 1024 * 1024) return setError("A imagem deve ter até 5 MB.");
    setBusy(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `site/${id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(COVER_BUCKET).upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) return setError("Não foi possível enviar a imagem. Tente novamente.");
    onChange(path);
  };

  return (
    <Field id={id} label={label}>
      <div className="flex items-center gap-4">
        {preview && <img src={preview} alt="Pré-visualização" className={`size-28 border border-border object-cover ${round ? "rounded-full" : ""}`} />}
        <div className="font-sans text-sm">
          <input id={id} type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0])} className="block text-sm" />
          <p className="mt-2 text-xs text-muted-foreground">{busy ? "Enviando…" : "JPG ou PNG, até 5 MB. Salve para publicar."}</p>
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </Field>
  );
}

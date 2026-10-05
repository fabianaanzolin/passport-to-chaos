import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { COVER_BUCKET, resolveCover, slugify, type EpisodeRow } from "@/lib/episodes-db";
import { quadros } from "@/lib/content";
import { Notice, ghostBtn, inputClass, labelClass, primaryBtn } from "./admin-ui";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

type Values = {
  number: string; title: string; quadro: string; short_description: string; description: string;
  published_on: string; spotify_url: string; youtube_url: string; status: string; featured: boolean;
};

const empty: Values = {
  number: "", title: "", quadro: "vida-a-bordo", short_description: "", description: "",
  published_on: new Date().toISOString().slice(0, 10), spotify_url: "", youtube_url: "", status: "draft", featured: false,
};

export function EpisodeForm({ episode }: { episode?: EpisodeRow }) {
  const navigate = useNavigate();
  const [v, setV] = useState<Values>(() =>
    episode
      ? {
          number: episode.number, title: episode.title, quadro: episode.quadro,
          short_description: episode.short_description ?? "", description: episode.description ?? "",
          published_on: episode.published_on ?? "", spotify_url: episode.spotify_url ?? "",
          youtube_url: episode.youtube_url ?? "", status: episode.status, featured: episode.featured,
        }
      : empty,
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (episode?.cover_url) resolveCover(episode.cover_url).then(setPreview);
  }, [episode?.cover_url]);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((s) => ({ ...s, [k]: val }));

  const pick = (f: File | undefined) => {
    setError("");
    if (!f) return;
    if (!TYPES.includes(f.type)) return setError("Formato não aceito. Use uma imagem JPG, PNG ou WEBP.");
    if (f.size > MAX_BYTES) return setError("A imagem é grande demais. O limite é 5 MB.");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (!v.number.trim() || !v.title.trim()) return setError("Preencha o número e o título do episódio.");
    setBusy(true);
    try {
      let cover_url = episode?.cover_url ?? null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `covers/${Date.now()}-${slugify(v.number, v.title)}.${ext}`;
        const { error: upErr } = await supabase.storage.from(COVER_BUCKET).upload(path, file, { contentType: file.type });
        if (upErr) throw new Error("upload");
        cover_url = path;
      }
      const payload = {
        number: v.number.trim(),
        title: v.title.trim(),
        // Keep the existing address of published episodes so shared links keep working.
        slug: episode?.slug ?? slugify(v.number.trim(), v.title.trim()),
        quadro: v.quadro,
        cover_url,
        short_description: v.short_description.trim() || null,
        description: v.description.trim() || null,
        published_on: v.published_on || null,
        spotify_url: v.spotify_url.trim() || null,
        youtube_url: v.youtube_url.trim() || null,
        status: v.status,
        featured: v.featured,
      };
      const { error: dbErr } = episode
        ? await supabase.from("episodes").update(payload).eq("id", episode.id)
        : await supabase.from("episodes").insert(payload);
      if (dbErr) throw new Error(dbErr.code === "23505" ? "dup" : "db");
      if (episode) {
        setOk("Episódio atualizado com sucesso.");
        setFile(null);
      } else {
        navigate({ to: "/admin/episodios", search: { salvo: 1 } });
      }
    } catch (err) {
      const m = (err as Error).message;
      setError(
        m === "dup" ? "Já existe um episódio com esse número e título."
          : m === "upload" ? "Não foi possível enviar a imagem. Tente novamente."
          : "Não foi possível salvar. Confira os campos e tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-5 border border-border bg-background p-6">
        <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
          <Field label="Número do episódio" id="number">
            <input id="number" placeholder="003" value={v.number} onChange={(e) => set("number", e.target.value)} className={inputClass} required />
          </Field>
          <Field label="Título" id="title">
            <input id="title" value={v.title} onChange={(e) => set("title", e.target.value)} className={inputClass} required />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Quadro" id="quadro">
            <select id="quadro" value={v.quadro} onChange={(e) => set("quadro", e.target.value)} className={inputClass}>
              {Object.values(quadros).map((q) => <option key={q.slug} value={q.slug}>{q.name}</option>)}
            </select>
          </Field>
          <Field label="Data de publicação" id="date">
            <input id="date" type="date" value={v.published_on} onChange={(e) => set("published_on", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Chamada curta" id="short" hint={`Usada nos cards do site. Recomendado até 160 caracteres (${v.short_description.length}/160).`}>
          <textarea id="short" rows={2} value={v.short_description} onChange={(e) => set("short_description", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Descrição completa" id="desc">
          <textarea id="desc" rows={6} value={v.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Link do Spotify" id="sp">
            <input id="sp" type="url" placeholder="https://open.spotify.com/episode/…" value={v.spotify_url} onChange={(e) => set("spotify_url", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Link do YouTube (opcional)" id="yt">
            <input id="yt" type="url" placeholder="https://youtube.com/…" value={v.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} className={inputClass} />
          </Field>
        </div>
        {!episode && v.number && v.title && (
          <p className="font-sans text-xs text-muted-foreground">Endereço da página: /episodios/{slugify(v.number, v.title)}</p>
        )}
      </div>

      <div className="space-y-5">
        <div className="border border-border bg-background p-5">
          <p className={labelClass}>Capa do episódio</p>
          <div className="flex aspect-[4/5] items-center justify-center bg-secondary p-3">
            {preview ? (
              <img src={preview} alt="Prévia da capa" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="font-sans text-xs text-muted-foreground">Sem imagem</span>
            )}
          </div>
          <label className={`${ghostBtn} mt-4 w-full cursor-pointer`}>
            <ImagePlus className="size-4" /> Selecionar imagem
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
          <p className="mt-2 font-sans text-[0.7rem] text-muted-foreground">JPG, PNG ou WEBP, até 5 MB.</p>
        </div>

        <div className="space-y-4 border border-border bg-background p-5">
          <Field label="Status" id="status">
            <select id="status" value={v.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </Field>
          <label className="flex items-start gap-3 font-sans text-sm">
            <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} className="mt-1 size-4 accent-[var(--stamp)]" />
            <span>
              <span className="font-bold">Destacar na Home</span>
              <span className="block text-xs text-muted-foreground">Só um episódio fica em destaque por vez.</span>
            </span>
          </label>
        </div>

        {error && <Notice tone="error">{error}</Notice>}
        {ok && <Notice>{ok}</Notice>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy ? "Salvando…" : episode ? "Salvar alterações" : "Salvar episódio"}
          </button>
          <Link to="/admin/episodios" className={ghostBtn}>Cancelar</Link>
        </div>
      </div>
    </form>
  );
}

function Field({ label, id, hint, children }: { label: string; id: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {children}
      {hint && <p className="mt-1.5 font-sans text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

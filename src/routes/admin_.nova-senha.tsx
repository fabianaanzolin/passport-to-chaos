import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, Notice, adminMeta, inputClass, labelClass, primaryBtn } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin_/nova-senha")({
  ssr: false,
  head: () => ({ meta: adminMeta("Nova senha") }),
  component: NewPassword,
});

function NewPassword() {
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // The e-mail link signs the person in temporarily; wait for that session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setReady((r) => r ?? !!data.session);
    }, 1500);
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return setError("A senha precisa ter pelo menos 8 caracteres, com letras e números.");
    }
    if (password !== confirm) return setError("As duas senhas não são iguais.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      return setError(
        /weak|pwned|compromised/i.test(error.message)
          ? "Essa senha é muito comum ou já apareceu em vazamentos. Escolha outra."
          : "Não foi possível salvar a nova senha. Solicite um novo link e tente de novo.",
      );
    }
    setDone(true);
  };

  if (done) {
    return (
      <AuthCard title="Senha alterada com sucesso.">
        <Link to="/admin" className={`${primaryBtn} w-full`}>Entrar no admin</Link>
      </AuthCard>
    );
  }

  if (ready === false) {
    return (
      <AuthCard title="Link inválido ou expirado">
        <p className="mb-6 text-center font-sans text-sm text-muted-foreground">Solicite um novo link de recuperação.</p>
        <Link to="/admin/recuperar-senha" className={`${primaryBtn} w-full`}>Solicitar novo link</Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Criar nova senha">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="pw" className={labelClass}>Nova senha</label>
          <input id="pw" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          <p className="mt-1.5 font-sans text-xs text-muted-foreground">Mínimo de 8 caracteres, com letras e números.</p>
        </div>
        <div>
          <label htmlFor="pw2" className={labelClass}>Confirmar nova senha</label>
          <input id="pw2" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
        </div>
        {error && <Notice tone="error">{error}</Notice>}
        <button type="submit" disabled={busy || ready === null} className={`${primaryBtn} w-full`}>
          {busy ? "Salvando…" : "Salvar nova senha"}
        </button>
      </form>
    </AuthCard>
  );
}

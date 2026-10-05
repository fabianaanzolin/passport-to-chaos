import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, Notice, adminMeta, inputClass, labelClass, primaryBtn } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/admin_/recuperar-senha")({
  ssr: false,
  head: () => ({ meta: adminMeta("Recuperar senha") }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    // The answer is always the same, so nobody can find out which e-mails have an account.
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/nova-senha`,
    });
    setBusy(false);
    setSent(true);
  };

  return (
    <AuthCard title="Recuperar senha">
      {sent ? (
        <Notice>Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.</Notice>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="font-sans text-sm text-muted-foreground">Informe o e-mail cadastrado para receber o link de recuperação.</p>
          <div>
            <label htmlFor="email" className={labelClass}>E-mail</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" disabled={busy} className={`${primaryBtn} w-full`}>
            {busy ? "Enviando…" : "Enviar link de recuperação"}
          </button>
        </form>
      )}
      <div className="mt-6 text-center">
        <Link to="/admin" className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground hover:text-accent">
          Voltar para o login
        </Link>
      </div>
    </AuthCard>
  );
}

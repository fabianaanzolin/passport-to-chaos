import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Menu, X, Youtube } from "lucide-react";
import {
  facebookUrl,
  images,
  instagramUrl,
  mainNav,
  spotifyUrl,
  youtubeUrl,
} from "@/lib/site";

export function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.882 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.739.30 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C9.6 11.22 3.84 11.7 0 13.8c-.48.181-1.021-.06-1.2-.6-.18-.48.06-1.021.6-1.2 4.2-2.4 10.56-3 14.88-.72.48.3.6 1.02.3 1.5z" />
    </svg>
  );
}

const socials = [
  { href: spotifyUrl, label: "Spotify", Icon: SpotifyIcon },
  { href: instagramUrl, label: "Instagram", Icon: Instagram },
  { href: youtubeUrl, label: "YouTube", Icon: Youtube },
  { href: facebookUrl, label: "Facebook", Icon: Facebook },
];

function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socials.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${label} do Passaporte para o Caos`}
          className="text-foreground transition-colors hover:text-accent"
        >
          <Icon className="size-4" />
        </a>
      ))}
    </div>
  );
}

const navLinkClass =
  "text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-30 mx-auto max-w-[1440px] px-6 pt-6 sm:px-10 lg:px-16 lg:pt-8">
      <header className="flex items-center justify-between gap-6 border-b border-border pb-5">
        <Link to="/" aria-label="Passaporte para o Caos — início" onClick={() => setOpen(false)}>
          <img
            src={images.logo}
            alt="Passaporte para o Caos"
            className="size-20 rounded-full object-cover sm:size-24"
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 font-sans lg:flex xl:gap-8">
          {mainNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={navLinkClass}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-accent" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <SocialIcons className="hidden sm:flex" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="grid size-11 place-items-center rounded-full border border-border text-foreground lg:hidden"
          >
            {open ? <X className="size-5" strokeWidth={1.6} /> : <Menu className="size-5" strokeWidth={1.6} />}
          </button>
        </div>
      </header>

      {open && (
        <div
          id="menu-mobile"
          className="absolute inset-x-6 top-full mt-2 border border-border bg-background p-6 shadow-[0_24px_60px_-30px_color-mix(in_oklab,var(--foreground)_45%,transparent)] sm:inset-x-10 lg:hidden"
        >
          <nav aria-label="Menu" className="flex flex-col">
            {mainNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-accent" }}
                className="border-b border-border py-3.5 font-display text-2xl font-semibold text-foreground last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <SocialIcons className="mt-5 sm:hidden" />
        </div>
      )}
    </div>
  );
}

export function SiteFooter() {
  const links: { label: string; to?: string; href?: string; external?: boolean }[] = [
    { label: "Início", to: "/" },
    { label: "Episódios", to: "/episodios" },
    { label: "Quadros", to: "/quadros" },
    { label: "Conte sua história", to: "/conte-sua-historia" },
    { label: "Sobre", to: "/sobre" },
    { label: "Contato", to: "/contato" },
  ];

  return (
    <footer className="bg-background px-6 py-14 font-sans sm:px-10">
      <div className="mx-auto flex max-w-[1312px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <img src={images.logo} alt="Passaporte para o Caos" className="size-16 rounded-full object-cover sm:size-20" />

        <nav
          className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-[0.16em] text-foreground sm:flex sm:max-w-md sm:flex-wrap"
          aria-label="Navegação do rodapé"
        >
          {links.map((l) => (
            <Link key={l.label} to={l.to!} className="transition-colors hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>

        <SocialIcons />

        <div className="text-xs text-muted-foreground lg:text-right">
          <p>© 2026 Passaporte para o Caos</p>
          <p>Todos os direitos reservados.</p>
          <p className="mt-3 text-[0.68rem]">
            Produzido por{" "}
            <a
              href="https://www.anzolinconsultoria.com.br"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              Anzolin Consultoria
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mb-5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.28em] text-muted-foreground ${className}`}>
      {children}
    </p>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1312px] px-6 pb-12 pt-14 sm:px-10 lg:pb-16 lg:pt-20">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.9] font-semibold text-balance">
        {title}
      </h1>
      {children && (
        <div className="mt-7 max-w-2xl font-sans text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {children}
        </div>
      )}
    </section>
  );
}

export function StoryNotice() {
  return (
    <div className="space-y-3 font-sans text-[0.82rem] leading-relaxed text-muted-foreground sm:text-sm sm:leading-relaxed">
      <p>
        Importante: o envio da história não significa publicação automática. A equipe do Passaporte
        para o Caos analisará o material antes de utilizá-lo.
      </p>
      <p>
        Para preservar a identidade do autor ou de outras pessoas mencionadas, informações
        identificáveis poderão ser alteradas, omitidas ou substituídas durante a edição, incluindo
        nomes, apelidos, cargos, empresas, navios, cidades, locais, datas, rotas ou outros detalhes
        que possam permitir a identificação de uma pessoa.
      </p>
      <p>
        Quando necessário, a história também poderá ser adaptada editorialmente para preservar o
        anonimato, sem alterar o sentido essencial do relato.
      </p>
    </div>
  );
}

export function StoryInvite({ title = "Você tem uma história?" }: { title?: string }) {
  return (
    <section className="border-y border-border bg-secondary px-6 py-16 sm:px-10 lg:py-20">
      <div className="mx-auto flex max-w-[1312px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <Eyebrow>Conte sua história</Eyebrow>
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-semibold">{title}</h2>
          <p className="mt-5 font-sans text-base leading-7 text-muted-foreground sm:text-lg">
            Aquele perrengue, aquela situação absurda, aquele encontro fora do roteiro. Talvez ele
            seja o próximo episódio.
          </p>
        </div>
        <Link
          to="/conte-sua-historia"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 font-sans text-sm font-bold uppercase tracking-[0.12em] text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Enviar minha história
        </Link>
      </div>
    </section>
  );
}

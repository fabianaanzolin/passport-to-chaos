import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, adminMeta } from "@/components/admin/admin-ui";
import { facebookUrl, instagramUrl, spotifyUrl, youtubeUrl } from "@/lib/site";

const links = [
  ["Spotify", spotifyUrl], ["Instagram", instagramUrl], ["YouTube", youtubeUrl], ["Facebook", facebookUrl],
];

export const Route = createFileRoute("/admin/links")({
  head: () => ({ meta: adminMeta("Links e redes") }),
  component: () => (
    <ComingSoon title="Links e redes">
      <p className="mb-4">Links usados hoje no site. A edição por aqui chega em breve.</p>
      <dl className="space-y-3">
        {links.map(([name, url]) => (
          <div key={name}>
            <dt className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-foreground">{name}</dt>
            <dd className="break-all"><a href={url} target="_blank" rel="noreferrer" className="hover:text-accent">{url}</a></dd>
          </div>
        ))}
      </dl>
    </ComingSoon>
  ),
});

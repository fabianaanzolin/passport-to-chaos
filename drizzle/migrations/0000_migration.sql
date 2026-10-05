create type public.app_role as enum ('admin', 'editor');

create table public.staff_members (
  email text primary key,
  role public.app_role not null,
  created_at timestamptz not null default now()
);
grant select on public.staff_members to authenticated;
grant all on public.staff_members to service_role;
alter table public.staff_members enable row level security;

create or replace function public.staff_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$
  select role from public.staff_members
  where email = lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.staff_role() is not null $$;

create policy "Staff read own row, admins read all" on public.staff_members
for select to authenticated
using (email = lower(coalesce(auth.jwt() ->> 'email', '')) or public.staff_role() = 'admin');

insert into public.staff_members (email, role) values
  ('fabiana@anzolinconsultoria.com.br', 'admin'),
  ('contato@passaporteparaocaos.com.br', 'editor');

create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  slug text not null unique,
  title text not null,
  quadro text not null default 'vida-a-bordo' check (quadro in ('vida-a-bordo', 'turbulencia')),
  cover_url text,
  short_description text,
  description text,
  published_on date,
  spotify_url text,
  youtube_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.episodes to anon;
grant select, insert, update, delete on public.episodes to authenticated;
grant all on public.episodes to service_role;
alter table public.episodes enable row level security;

create policy "Public reads published episodes" on public.episodes
for select to anon, authenticated using (status = 'published');
create policy "Staff read all episodes" on public.episodes
for select to authenticated using (public.is_staff());
create policy "Staff insert episodes" on public.episodes
for insert to authenticated with check (public.is_staff());
create policy "Staff update episodes" on public.episodes
for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff delete episodes" on public.episodes
for delete to authenticated using (public.is_staff());

create or replace function public.episodes_before_write()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger episodes_before_write before insert or update on public.episodes
for each row execute function public.episodes_before_write();

create or replace function public.episodes_single_featured()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.episodes set featured = false where id <> new.id and featured;
  return null;
end $$;
create trigger episodes_single_featured after insert or update of featured on public.episodes
for each row when (new.featured) execute function public.episodes_single_featured();

insert into public.episodes (number, slug, title, quadro, cover_url, short_description, published_on, spotify_url, status, featured) values
  ('002', '002-toxico-a-bordo', 'Tóxico a Bordo', 'vida-a-bordo', '/episodios/toxico-a-bordo.jpeg',
   'Uma história real sobre amor, manipulação e a coragem de recomeçar.', '2026-09-29',
   'https://open.spotify.com/episode/5oURT5qlWtPvakpfKvAUCm?si=THj312MoSV6xnuNshaOJQw&utm_source=native-share-menu&nd=1&dlsi=c17838cfa3e24b1f',
   'published', true),
  ('001', '001-saco-proibido', 'Saco Proibido', 'vida-a-bordo', '/quadros/vida-a-bordo.jpeg',
   null, '2026-09-23',
   'https://open.spotify.com/show/3pnAt7AZGwB2hoYEs45d7U?si=RueEwUTOS76nLt0odnxIRw&utm_source=copy-link',
   'published', false);

create policy "Anyone reads episode covers" on storage.objects
for select to anon, authenticated using (bucket_id = 'episode-covers');
create policy "Staff upload episode covers" on storage.objects
for insert to authenticated with check (bucket_id = 'episode-covers' and public.is_staff());
create policy "Staff update episode covers" on storage.objects
for update to authenticated using (bucket_id = 'episode-covers' and public.is_staff());
create policy "Staff delete episode covers" on storage.objects
for delete to authenticated using (bucket_id = 'episode-covers' and public.is_staff());
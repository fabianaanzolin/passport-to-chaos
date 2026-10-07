alter table public.staff_members add column if not exists name text;
alter table public.staff_members add column if not exists active boolean not null default true;

create or replace function public.staff_role()
returns public.app_role language sql stable security definer set search_path = public as $$
  select role from public.staff_members
  where email = lower(coalesce(auth.jwt() ->> 'email', '')) and active
$$;

grant insert, update, delete on public.staff_members to authenticated;

create policy "Admins add staff" on public.staff_members
for insert to authenticated with check (public.staff_role() = 'admin');
create policy "Admins update staff" on public.staff_members
for update to authenticated using (public.staff_role() = 'admin') with check (public.staff_role() = 'admin');
create policy "Admins remove staff" on public.staff_members
for delete to authenticated using (public.staff_role() = 'admin');

create or replace function public.staff_members_normalize()
returns trigger language plpgsql set search_path = public as $$
begin
  new.email := lower(trim(new.email));
  new.name := nullif(trim(coalesce(new.name, '')), '');
  return new;
end $$;
create trigger staff_members_normalize before insert or update on public.staff_members
for each row execute function public.staff_members_normalize();

create or replace function public.staff_members_keep_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.staff_members where role = 'admin' and active) then
    raise exception 'O sistema precisa manter pelo menos um Administrador ativo.';
  end if;
  return null;
end $$;
create constraint trigger staff_members_keep_admin after update or delete on public.staff_members
for each row execute function public.staff_members_keep_admin();

create or replace function public.admin_list_staff()
returns table(email text, name text, role public.app_role, active boolean, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if public.staff_role() is distinct from 'admin' then
    raise exception 'Acesso restrito a administradores.';
  end if;
  return query
    select s.email, s.name, s.role, s.active, s.created_at, u.last_sign_in_at
    from public.staff_members s
    left join auth.users u on lower(u.email) = s.email
    order by s.role, s.email;
end $$;
revoke all on function public.admin_list_staff() from public, anon;
grant execute on function public.admin_list_staff() to authenticated;

create or replace function public.guard_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.staff_members where email = lower(coalesce(new.email, '')) and active) then
    raise exception 'Cadastro não permitido.';
  end if;
  return new;
end $$;
create trigger guard_new_auth_user before insert on auth.users
for each row execute function public.guard_new_auth_user();
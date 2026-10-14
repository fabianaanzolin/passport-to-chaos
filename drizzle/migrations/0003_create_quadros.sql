CREATE TABLE public.quadros (
  slug text PRIMARY KEY,
  name text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  phrase text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.quadros TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quadros TO authenticated;
GRANT ALL ON public.quadros TO service_role;
ALTER TABLE public.quadros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active quadros" ON public.quadros FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY "Staff read all quadros" ON public.quadros FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Staff insert quadros" ON public.quadros FOR INSERT TO authenticated WITH CHECK (public.is_staff());
CREATE POLICY "Staff update quadros" ON public.quadros FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "Admins delete quadros" ON public.quadros FOR DELETE TO authenticated USING (public.staff_role() = 'admin'::public.app_role);

CREATE OR REPLACE FUNCTION public.quadros_before_write() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
begin
  if tg_op = 'DELETE' then
    if exists (select 1 from public.episodes e where e.quadro = old.slug) then
      raise exception 'Este quadro possui episódios associados. Para excluí-lo, primeiro transfira os episódios para outro quadro.';
    end if;
    return old;
  end if;
  if tg_op = 'UPDATE' and new.slug <> old.slug then
    raise exception 'O endereço do quadro não pode ser alterado.';
  end if;
  if new.slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or new.slug in ('vida-a-bordo','turbulencia') then
    raise exception 'Endereço inválido para o quadro.';
  end if;
  if btrim(new.name) = '' then raise exception 'Informe o nome do quadro.'; end if;
  new.updated_at := now();
  return new;
end $$;
CREATE TRIGGER quadros_before_write BEFORE INSERT OR UPDATE OR DELETE ON public.quadros
  FOR EACH ROW EXECUTE FUNCTION public.quadros_before_write();

CREATE OR REPLACE FUNCTION public.episodes_check_quadro() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
begin
  if tg_op = 'UPDATE' and new.quadro = old.quadro then return new; end if;
  if new.quadro in ('vida-a-bordo','turbulencia') then return new; end if;
  if not exists (select 1 from public.quadros q where q.slug = new.quadro and q.status = 'active') then
    raise exception 'Escolha um quadro ativo.';
  end if;
  return new;
end $$;
CREATE TRIGGER episodes_check_quadro BEFORE INSERT OR UPDATE ON public.episodes
  FOR EACH ROW EXECUTE FUNCTION public.episodes_check_quadro();
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff insert site content" ON public.site_content FOR INSERT TO authenticated
  WITH CHECK (public.is_staff() AND key IN ('hero','sobre','historia','perfil','links','quadro:vida-a-bordo','quadro:turbulencia'));
CREATE POLICY "Staff update site content" ON public.site_content FOR UPDATE TO authenticated
  USING (public.is_staff()) WITH CHECK (public.is_staff() AND key IN ('hero','sobre','historia','perfil','links','quadro:vida-a-bordo','quadro:turbulencia'));
CREATE OR REPLACE FUNCTION public.site_content_validate() RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
declare k text; v text;
begin
  new.updated_at := now();
  if new.key = 'links' then
    foreach k in array array['spotify','instagram','youtube','facebook'] loop
      v := new.data ->> k;
      if v is not null and v <> '' and v !~ '^https://[^\s]+$' then raise exception 'Link inválido: %', k; end if;
    end loop;
    v := new.data ->> 'email';
    if v is not null and v <> '' and v !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'E-mail inválido'; end if;
  end if;
  return new;
end $$;
CREATE TRIGGER site_content_validate BEFORE INSERT OR UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.site_content_validate();
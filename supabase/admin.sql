-- Panel de la tienda: quién puede administrar y qué permisos tiene sobre el catálogo y las fotos.
-- Ejecútalo después de schema.sql. Se puede volver a ejecutar sin problema.

-- 1) Personas administradoras. Solo se agregan desde el SQL Editor (nadie puede auto-promoverse).
create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado timestamptz not null default now()
);

alter table public.administradores enable row level security;

drop policy if exists "Cada quien ve si es administrador" on public.administradores;
create policy "Cada quien ve si es administrador"
  on public.administradores for select
  using ((select auth.uid()) = user_id);

-- 2) Función que usan los permisos para saber si quien consulta es administrador.
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.administradores where user_id = (select auth.uid())
  );
$$;

revoke all on function public.es_admin() from public;
grant execute on function public.es_admin() to anon, authenticated;

-- 3) Solo las administradoras crean, editan y borran prendas.
drop policy if exists "Administradoras crean prendas" on public.productos;
create policy "Administradoras crean prendas"
  on public.productos for insert
  with check (public.es_admin());

drop policy if exists "Administradoras editan prendas" on public.productos;
create policy "Administradoras editan prendas"
  on public.productos for update
  using (public.es_admin())
  with check (public.es_admin());

drop policy if exists "Administradoras borran prendas" on public.productos;
create policy "Administradoras borran prendas"
  on public.productos for delete
  using (public.es_admin());

-- 4) Bucket público para las fotos (5 MB máximo, solo imágenes).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('prendas', 'prendas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Las fotos se ven por su enlace público; solo las administradoras suben, cambian o borran.
drop policy if exists "Administradoras suben fotos" on storage.objects;
create policy "Administradoras suben fotos"
  on storage.objects for insert
  with check (bucket_id = 'prendas' and public.es_admin());

drop policy if exists "Administradoras cambian fotos" on storage.objects;
create policy "Administradoras cambian fotos"
  on storage.objects for update
  using (bucket_id = 'prendas' and public.es_admin());

drop policy if exists "Administradoras borran fotos" on storage.objects;
create policy "Administradoras borran fotos"
  on storage.objects for delete
  using (bucket_id = 'prendas' and public.es_admin());

-- 5) Convierte tu cuenta en administradora (primero crea la cuenta en la web con ese correo).
--    Quita los guiones de las dos líneas siguientes y cambia el correo:
-- insert into public.administradores (user_id)
-- select id from auth.users where email = 'tu-correo@ejemplo.com';

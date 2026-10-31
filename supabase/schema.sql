-- Esquema de Vintage Flow.
-- Pégalo completo en Supabase > SQL Editor > New query y ejecútalo una vez.

-- Prendas del catálogo. Todo el mundo puede verlas; solo se editan desde el panel de Supabase.
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null check (categoria in ('Camisas', 'Chaquetas', 'Pantalones', 'Accesorios')),
  talla text,
  estado text,
  precio numeric(10, 2),
  foto_url text,
  vendido boolean not null default false,
  creado timestamptz not null default now()
);

alter table public.productos enable row level security;

create policy "Las prendas las ve cualquiera"
  on public.productos for select
  using (true);

-- Sin políticas de insert/update/delete: nadie puede modificar el catálogo desde la web.
-- Las prendas se cargan en Supabase > Table Editor (o con la service role desde un script).

-- Favoritos: cada persona ve y cambia solo los suyos.
create table if not exists public.favoritos (
  user_id uuid not null references auth.users (id) on delete cascade,
  producto_id uuid not null references public.productos (id) on delete cascade,
  creado timestamptz not null default now(),
  primary key (user_id, producto_id)
);

alter table public.favoritos enable row level security;

create policy "Cada quien ve sus favoritos"
  on public.favoritos for select
  using ((select auth.uid()) = user_id);

create policy "Cada quien agrega sus favoritos"
  on public.favoritos for insert
  with check ((select auth.uid()) = user_id);

create policy "Cada quien quita sus favoritos"
  on public.favoritos for delete
  using ((select auth.uid()) = user_id);

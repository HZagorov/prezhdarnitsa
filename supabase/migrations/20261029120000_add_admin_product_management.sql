-- Admin access is deliberately kept separate from the public customer profile.
alter table public.profiles
  add column if not exists role text not null default 'customer'
  check (role in ('customer', 'admin'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Customers can still see active products. Admins can see the complete catalog.
drop policy if exists "Admins can view all products" on public.products;
create policy "Admins can view all products"
  on public.products for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can create products" on public.products;
create policy "Admins can create products"
  on public.products for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Keep product variants available to the editor as well. This table is included
-- here because the application already reads it, but older environments may not
-- have received its schema yet.
create table if not exists public.product_variants (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  name text not null,
  image_key text not null,
  is_active boolean not null default true
);

grant select on table public.products to anon, authenticated;
grant insert, update on table public.products to authenticated;
grant select on table public.product_variants to anon, authenticated;
grant insert, update, delete on table public.product_variants to authenticated;

alter table public.product_variants enable row level security;

drop policy if exists "Anyone can read active product variants" on public.product_variants;
create policy "Anyone can read active product variants"
  on public.product_variants for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Admins can view all product variants" on public.product_variants;
create policy "Admins can view all product variants"
  on public.product_variants for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can create product variants" on public.product_variants;
create policy "Admins can create product variants"
  on public.product_variants for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can update product variants" on public.product_variants;
create policy "Admins can update product variants"
  on public.product_variants for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete product variants" on public.product_variants;
create policy "Admins can delete product variants"
  on public.product_variants for delete
  to authenticated
  using ((select public.is_admin()));

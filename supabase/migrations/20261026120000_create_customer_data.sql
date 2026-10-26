create extension if not exists pgcrypto;

-- One application profile per Supabase Auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Saved delivery addresses. These are private to the owning user.
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  city text not null,
  postal_code text not null,
  address_line text not null,
  notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses(user_id);

-- Orders keep customer and shipping snapshots so historical orders do not change
-- when a user edits their profile or saved address.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null
    check (payment_method in ('cod', 'card')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_city text not null,
  shipping_postal_code text not null,
  shipping_address text not null,
  customer_note text,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  shipping_cost numeric(10, 2) not null default 0 check (shipping_cost >= 0),
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- Product details are copied into each item so order history remains readable
-- even if the product name or price changes later.
create table if not exists public.order_item (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id) on delete restrict,
  product_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists order_item_order_id_idx on public.order_item(order_id);

-- Create an empty profile automatically when a user registers.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_item enable row level security;

revoke all on table public.profiles, public.addresses, public.orders, public.order_item from anon;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.addresses to authenticated;
grant select, insert on table public.orders to authenticated;
grant select, insert on table public.order_item to authenticated;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can manage their own addresses" on public.addresses;
create policy "Users can manage their own addresses"
  on public.addresses for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own orders" on public.orders;
create policy "Users can create their own orders"
  on public.orders for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can view items from their own orders" on public.order_item;
create policy "Users can view items from their own orders"
  on public.order_item for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders
      where public.orders.id = public.order_item.order_id
        and public.orders.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can add items to their own orders" on public.order_item;
create policy "Users can add items to their own orders"
  on public.order_item for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.orders
      where public.orders.id = public.order_item.order_id
        and public.orders.user_id = (select auth.uid())
    )
  );

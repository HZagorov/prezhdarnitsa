create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('prezhdi', 'makrame', 'gotovi', 'aksesoari')),
  subcategory text,
  price numeric(10, 2) not null check (price >= 0),
  old_price numeric(10, 2) check (old_price is null or old_price >= price),
  image_key text not null,
  gallery_keys text[] not null default '{}',
  description text,
  details text[] not null default '{}',
  badge text check (badge in ('Ново', 'Хит', 'Промоция')),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Anyone can read active products" on public.products;
create policy "Anyone can read active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

insert into public.products (
  id, name, category, subcategory, price, old_price, image_key, gallery_keys, description, details, badge, sort_order
) values
(
  'pamuchna-prezhda-rozova',
  'Памучна прежда „Розова нежност“',
  'prezhdi',
  'pamuk',
  6.90,
  null,
  'pamuchnaRozova',
  '{}',
  '100% памучна прежда в нежно розово — мека, дишаща и издръжлива. Идеална за летни дрехи, бебешки плетива и амигуруми играчки.',
  array['100% памук', '50 г / 125 м', 'Препоръчителни игли: 3–4 мм', 'Пере се в пералня на 30°'],
  'Хит',
  10
),
(
  'plushena-prezhda-sinya',
  'Плюшена прежда „Небесно синьо“',
  'prezhdi',
  null,
  8.50,
  null,
  'plushenaSinya',
  '{}',
  'Изключително мека плюшена прежда с кадифено усещане. Перфектна за пухкави одеяла, шапки и плюшени играчки.',
  array['100% полиестер', '100 г / 120 м', 'Препоръчителни игли: 6–8 мм', 'Хипоалергенна'],
  'Ново',
  20
),
(
  'bebe-prezhda-menta',
  'Бебешка прежда „Мента“',
  'prezhdi',
  null,
  5.90,
  null,
  'bebeMenta',
  '{}',
  'Премиум бебешка прежда в свежа мента — супер мека и безопасна за нежната бебешка кожа. Пере се лесно и съхне бързо.',
  array['100% антипилинг акрил', '50 г / 165 м', 'Препоръчителни игли: 3–3.5 мм', 'Сертифицирана за бебета'],
  null,
  30
),
(
  'gazzal-baby-cotton',
  'Памучна прежда „GAZZAL Baby Cotton“',
  'prezhdi',
  'pamuk',
  4.00,
  null,
  'gazzalBabyCotton',
  '{}',
  'Нежна памучна бебешка прежда GAZZAL Baby Cotton — мека, дишаща и приятна на допир. Подходяща за бебешки плетива, летни дрехи, шапки и амигуруми.',
  array['100% памук', '50 г / 165 м', 'Препоръчителни игли: 3–4 мм', 'Пере се на 30°'],
  'Ново',
  40
),
(
  'tekstilna-prezhda-koral',
  'Текстилна прежда „Корал“',
  'prezhdi',
  null,
  9.90,
  12.90,
  'tekstilnaKoral',
  '{}',
  'Еластична текстилна прежда в жизнерадостен коралов цвят. Страхотна за чанти, кошници, панери и килимчета.',
  array['Рециклиран памук с еластан', 'Около 700 г / 120 м', 'Кука: 8–10 мм', 'Стойна и устойчива'],
  'Промоция',
  50
),
(
  'makrame-lavandula',
  'Памучно макраме „Лавандула“ 3 мм',
  'makrame',
  null,
  14.90,
  null,
  'makrameLavandula',
  '{}',
  'Усукано памучно въже за макраме в приказна лавандула. Меко, здраво и лесно за работа — за панери, декорации и чанти.',
  array['100% памук', '3 мм / 200 м', 'Не се разплита лесно', 'Подходящо за начинаещи'],
  'Хит',
  60
),
(
  'pletena-chanta-payeti',
  'Плетена чанта с пайети „Бежов блясък“',
  'gotovi',
  null,
  79.90,
  null,
  'chantaPayeti2',
  array['chantaPayeti2', 'chantaPayeti'],
  'Ефектна ръчно плетена чанта тип торбичка в нежно бежово, украсена с кръгли пайети и кожена връзка. Плетената дръжка с метални вериги придава завършен и елегантен вид.',
  array['Ръчна изработка', 'Пайети в бежово и розово злато', 'Плетена дръжка с метални вериги', 'Кожена връзка с панделка', 'Дължина: 30 см', 'Ширина: 17 см', 'Височина: 24 см'],
  'Ново',
  70
),
(
  'pletena-chanta-sini',
  'Плетена чанта „Син прибой“',
  'gotovi',
  null,
  89.90,
  null,
  'chantaSini',
  array['chantaSini', 'chantaSini2'],
  null,
  array['Ръчна изработка', 'Дебела памучна връв', 'Плетена дръжка с метални накрайници', 'Метална пръчка по горния ръб', 'Дължина: 35 см', 'Ширина: 15 см', 'Височина: 24 см', 'Височина с дръжката: 46 см'],
  'Ново',
  80
),
(
  'pletena-chanta-cherna',
  'Плетена чанта „Черна нощ“',
  'gotovi',
  null,
  45.00,
  null,
  'chantaCherna',
  array['chantaCherna', 'chantaCherna2'],
  null,
  array['Ширина: 37 см', 'Дълбочина: 22 см', 'Височина с дръжката: 44 см'],
  'Ново',
  90
),
(
  'pletena-chanta-shareno-kare',
  'Плетена чанта „Шарено каре“',
  'gotovi',
  null,
  55.00,
  null,
  'chantaSharenoKare',
  '{}',
  null,
  array['Ширина: 24 см', 'Дълбочина: 13 см', 'Височина: 18 см', 'Височина с дръжката: 33 см'],
  'Ново',
  100
),
(
  'komplekt-kuki',
  'Комплект ергономични куки 2–6 мм',
  'aksesoari',
  null,
  24.90,
  29.90,
  'kuki',
  '{}',
  'Комплект от 11 ергономични куки с меки пастелни дръжки. Удобни дори при дълго плетене — ръцете ви ще ви благодарят.',
  array['11 размера: 2.0–6.0 мм', 'Меки силиконови дръжки', 'Алуминиеви върхове', 'Практичен калъф'],
  'Промоция',
  110
),
(
  'durveni-druzhki-osnova',
  'Дървени дръжки и основа за чанта',
  'aksesoari',
  null,
  16.90,
  null,
  'drazhki',
  '{}',
  'Комплект дървени дръжки и кръгла основа от шперплат за плетена чанта, с кожен етикет „Handmade“. Здравина и стил за вашия проект.',
  array['Естествено дърво', 'Основа Ø 20 см с отвори', '2 дръжки', 'Кожен етикет в комплекта'],
  null,
  120
)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  subcategory = excluded.subcategory,
  price = excluded.price,
  old_price = excluded.old_price,
  image_key = excluded.image_key,
  gallery_keys = excluded.gallery_keys,
  description = excluded.description,
  details = excluded.details,
  badge = excluded.badge,
  sort_order = excluded.sort_order,
  updated_at = now();


import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

type Sort = "popular" | "price-asc" | "price-desc" | "name";

export const Route = createFileRoute("/katalog")({
  validateSearch: (search: Record<string, unknown>) => ({
    kategoriq: (search.kategoriq as Category | "vsichki") || "vsichki",
  }),
  head: () => ({
    meta: [
      { title: "Каталог — Преждарница" },
      {
        name: "description",
        content: "Разгледайте всички прежди, макраме, аксесоари и ръчно плетени артикули в каталога на Преждарница.",
      },
      { property: "og:title", content: "Каталог — Преждарница" },
      { property: "og:description", content: "Всички прежди, макраме, аксесоари и ръчно плетени артикули." },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { kategoriq } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [sort, setSort] = useState<Sort>("popular");
  const [maxPrice, setMaxPrice] = useState(100);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.price <= maxPrice);
    if (kategoriq !== "vsichki") list = list.filter((p) => p.category === kategoriq);
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name, "bg"));
      default:
        return list;
    }
  }, [kategoriq, sort, maxPrice]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold text-foreground">Каталог</h1>
      <p className="mt-2 text-muted-foreground">Всичко за вашите креативни проекти на едно място.</p>

      {/* Филтри */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => navigate({ search: { kategoriq: "vsichki" } })}
          className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
            kategoriq === "vsichki" ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
          }`}
        >
          Всички
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate({ search: { kategoriq: cat.id } })}
            className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
              kategoriq === cat.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6 rounded-2xl bg-card p-4">
        <label className="flex items-center gap-3 text-sm font-bold">
          Цена до: <span className="text-primary">{maxPrice} лв.</span>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="accent-primary"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          Подреди:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-xl border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="popular">Популярни</option>
            <option value="price-asc">Цена: ниска → висока</option>
            <option value="price-desc">Цена: висока → ниска</option>
            <option value="name">По име</option>
          </select>
        </label>
        <span className="text-sm text-muted-foreground">{filtered.length} продукта</span>
      </div>

      {/* Продукти */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">Няма продукти, отговарящи на филтрите. 🧶</p>
      )}
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBasket, Check, Minus, Plus, Truck, RotateCcw } from "lucide-react";
import { CATEGORIES, formatPrice, getProduct, PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/produkt/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Преждарница` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — Преждарница` },
          { property: "og:description", content: loaderData.description },
        ]
      : [{ title: "Продукт — Преждарница" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const shown = Math.min(activeImg, images.length - 1);

  const category = CATEGORIES.find((c) => c.id === product.category);
  const similar = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    add(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Начало</Link>
        <span className="mx-2">/</span>
        <Link to="/katalog" search={{ kategoriq: product.category }} className="hover:text-primary">
          {category?.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
            <img
              src={images[shown]}
              alt={product.name}
              width={816}
              height={816}
              className="aspect-square w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  aria-label={`Снимка ${i + 1} на ${product.name}`}
                  aria-current={i === shown}
                  className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all ${
                    i === shown ? "border-primary" : "border-border opacity-80 hover:border-primary/60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" width={816} height={816} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          {product.badge && (
            <span className="inline-block rounded-full bg-berry px-3 py-1 text-xs font-extrabold text-berry-foreground">
              {product.badge}
            </span>
          )}
          <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground md:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> {d}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-input bg-card">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-3 hover:text-primary"
                aria-label="Намали количеството"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-extrabold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:text-primary" aria-label="Увеличи количеството">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-extrabold transition-all ${
                added ? "bg-skyblue text-skyblue-foreground" : "bg-primary text-primary-foreground hover:scale-105"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" /> Добавено!
                </>
              ) : (
                <>
                  <ShoppingBasket className="h-5 w-5" /> Добави в количката
                </>
              )}
            </button>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl bg-muted p-4 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> Доставка 1–2 работни дни
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" /> Връщане до 14 дни
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold text-foreground">Може да ви хареса още</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

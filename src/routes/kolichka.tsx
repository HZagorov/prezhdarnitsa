import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBasket } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";

const FREE_SHIPPING_FROM = 80;
const SHIPPING_COST = 6.9;

export const Route = createFileRoute("/kolichka")({
  head: () => ({
    meta: [
      { title: "Количка — Преждарница" },
      { name: "description", content: "Прегледайте избраните прежди и плетени артикули и завършете поръчката си." },
      { property: "og:title", content: "Количка — Преждарница" },
      { property: "og:description", content: "Прегледайте избраните продукти и завършете поръчката си." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { detailed, setQty, remove, total } = useCart();

  const shipping = total >= FREE_SHIPPING_FROM || total === 0 ? 0 : SHIPPING_COST;

  if (detailed.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="text-6xl">🧺</span>
        <h1 className="mt-4 font-display text-3xl font-extrabold">Количката е празна</h1>
        <p className="mt-2 text-muted-foreground">Разгледайте каталога и намерете нещо, което да ви вдъхнови.</p>
        <Link
          to="/katalog"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-extrabold text-primary-foreground transition-transform hover:scale-105"
        >
          <ShoppingBasket className="h-5 w-5" /> Към каталога
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold">Вашата количка</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {detailed.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-4 rounded-3xl border border-border bg-card p-4">
              <Link to="/produkt/$id" params={{ id: product.id }} className="shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link
                  to="/produkt/$id"
                  params={{ id: product.id }}
                  className="font-display font-bold hover:text-primary"
                >
                  {product.name}
                </Link>
                <span className="text-sm text-muted-foreground">{formatPrice(product.price)} / бр.</span>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-input">
                    <button onClick={() => setQty(product.id, qty - 1)} className="p-2 hover:text-primary" aria-label="Намали">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="p-2 hover:text-primary" aria-label="Увеличи">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-primary">{formatPrice(product.price * qty)}</span>
                    <button
                      onClick={() => remove(product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive"
                      aria-label="Премахни"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-extrabold">Обобщение</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Продукти</dt>
              <dd className="font-bold">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Доставка</dt>
              <dd className="font-bold">{shipping === 0 ? "Безплатна" : formatPrice(shipping)}</dd>
            </div>
          </dl>
          {shipping > 0 && (
            <p className="mt-3 rounded-xl bg-sunshine px-3 py-2 text-xs font-bold text-sunshine-foreground">
              Още {formatPrice(FREE_SHIPPING_FROM - total)} до безплатна доставка!
            </p>
          )}
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="font-display text-lg font-extrabold">Общо</span>
            <span className="font-display text-lg font-extrabold text-primary">{formatPrice(total + shipping)}</span>
          </div>
          <Link
            to="/porachka"
            className="mt-5 block rounded-full bg-primary px-6 py-3 text-center font-extrabold text-primary-foreground transition-transform hover:scale-105"
          >
            Завърши поръчката
          </Link>
          <Link to="/katalog" className="mt-3 block text-center text-sm font-bold text-primary hover:underline">
            Продължи пазаруването
          </Link>
        </aside>
      </div>
    </div>
  );
}
